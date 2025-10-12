import Database from 'better-sqlite3'
import { readBody, setResponseStatus } from 'h3'
import { sanitizePerms } from '../../utils/permissions'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const username = body?.username
  const perms = sanitizePerms(body?.perms)

  if (!username || typeof username !== 'string') {
    setResponseStatus(event, 400)
    return { message: 'username is required' }
  }

  try {
    const db = new Database('wikidata.db', { fileMustExist: false })

    db.prepare(`CREATE TABLE IF NOT EXISTS users (
      uuid TEXT,
      name TEXT,
      email TEXT,
      isIP BOOLEAN,
      isAutoVerifiedUser BOOLEAN,
      perms TEXT
    )`).run()
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_name ON users(name)`).run()

    const serialized = JSON.stringify(perms)

    const upsert = db.prepare(`INSERT INTO users (name, perms) VALUES (?, ?)
      ON CONFLICT(name) DO UPDATE SET perms = excluded.perms`)
    upsert.run(username, serialized)
    db.close()
  return { ok: true, perms }
  } catch (err) {
    setResponseStatus(event, 500)
    return { message: 'database error' }
  }
})
