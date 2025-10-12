import Database from 'better-sqlite3'
import { getQuery, setResponseStatus } from 'h3'
import { sanitizePerms } from '../../utils/permissions'

export default defineEventHandler((event) => {
  const { username } = getQuery(event)
  if (!username || typeof username !== 'string') {
    setResponseStatus(event, 400)
    return { message: 'username is required', username: null, perms: [] }
  }

  try {
    const db = new Database('wikidata.db', { fileMustExist: false })
    // ensure table exists
    db.prepare(`CREATE TABLE IF NOT EXISTS users (
      uuid TEXT,
      name TEXT,
      email TEXT,
      isIP BOOLEAN,
      isAutoVerifiedUser BOOLEAN,
      perms TEXT
    )`).run()

    const row = db.prepare('SELECT name, perms FROM users WHERE name = ? LIMIT 1').get(username)
    db.close()

    if (!row) {
      return { username: null, perms: [] }
    }

    let parsed = []
    if (row.perms != null) {
      try {
        parsed = typeof row.perms === 'string' ? JSON.parse(row.perms) : row.perms
      } catch {
        parsed = []
      }
    }

  return { username: row.name, perms: sanitizePerms(parsed) }
  } catch (err) {
    setResponseStatus(event, 500)
    return { message: 'database error', username: null, perms: [] }
  }
})
