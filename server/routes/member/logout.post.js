import Database from 'better-sqlite3'
import { getCookie, setCookie } from 'h3'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'session_token')
  if (token) {
    const db = new Database('wikidata.db', { fileMustExist: false })
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
    db.close()
  }
  setCookie(event, 'session_token', '', { httpOnly: true, maxAge: 0, path: '/' })
  return { ok: true }
})
