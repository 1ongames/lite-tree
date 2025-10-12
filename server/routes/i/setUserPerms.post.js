import Database from 'better-sqlite3'
import { readBody, setResponseStatus } from 'h3'
import { sanitizePerms, grantablePermsByActor } from '../../utils/permissions'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const username = body?.username
  const actor = event.context.actorName

  if (!username || typeof username !== 'string') {
    setResponseStatus(event, 400)
    return { message: 'username is required' }
  }
  if (!actor || typeof actor !== 'string') {
    setResponseStatus(event, 403)
    return { message: 'forbidden: missing actor' }
  }

  try {
    const db = new Database('wikidata.db', { fileMustExist: false })
    // ensure table/index
    db.prepare(`CREATE TABLE IF NOT EXISTS users (
      uuid TEXT,
      name TEXT,
      email TEXT,
      isIP BOOLEAN,
      isAutoVerifiedUser BOOLEAN,
      perms TEXT NOT NULL CHECK (json_valid(perms) AND json_type(perms, '$') = 'array')
    )`).run()
    try { db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_name ON users(name)`).run() } catch {}

    // load actor perms
    const actorRow = db.prepare('SELECT perms FROM users WHERE name = ? LIMIT 1').get(actor)
    let actorPerms = []
    if (actorRow?.perms) {
      try { actorPerms = Array.isArray(actorRow.perms) ? actorRow.perms : JSON.parse(actorRow.perms) } catch {}
    }
    if (!grantablePermsByActor(actorPerms).length) {
      db.close()
      setResponseStatus(event, 403)
      return { message: 'forbidden' }
    }

    const perms = sanitizePerms(body?.perms, actorPerms)

    const serialized = JSON.stringify(perms)

    try {
      const upsert = db.prepare(`INSERT INTO users (name, perms) VALUES (?, ?)
        ON CONFLICT(name) DO UPDATE SET perms = excluded.perms`)
      upsert.run(username, serialized)
    } catch (e) {
      // Fallback if UNIQUE index is missing or conflict target unsupported
      const upd = db.prepare(`UPDATE users SET perms = ? WHERE name = ?`).run(serialized, username)
      if (!upd.changes) {
        db.prepare(`INSERT INTO users (name, perms) VALUES (?, ?)`).run(username, serialized)
      }
    }
    db.close()
    return { ok: true, perms }
  } catch (err) {
    setResponseStatus(event, 500)
    return { message: 'database error' }
  }
})
