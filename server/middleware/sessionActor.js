import { getCookie } from 'h3'
import Database from 'better-sqlite3'

export default defineEventHandler((event) => {
  // 세션 토큰으로 인증: session_token → sessions 테이블 확인
  try {
    const token = getCookie(event, 'honoka')
    if (!token) return
    const db = new Database('wikidata.db', { fileMustExist: false })
    db.prepare(`CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires DATETIME
    )`).run()
    const row = db.prepare('SELECT user_name, expires FROM sessions WHERE token = ?').get(token)
    if (row) {
      const now = Date.now()
      const exp = row.expires ? new Date(row.expires).getTime() : 0
      if (!exp || exp > now) {
        event.context.actorName = row.user_name
      }
    }
    db.close()
  } catch {}
})
