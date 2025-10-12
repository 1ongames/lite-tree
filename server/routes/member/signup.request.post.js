import Database from 'better-sqlite3'
import { readBody, setResponseStatus } from 'h3'
import { newToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = (body?.email || '').trim().toLowerCase()
  const agree = !!body?.agree
  if (!email || !agree) {
    setResponseStatus(event, 400)
    return { message: 'email and agree required' }
  }
  const db = new Database('wikidata.db', { fileMustExist: false })
  db.prepare(`CREATE TABLE IF NOT EXISTS signup_tokens (
    token TEXT PRIMARY KEY,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires DATETIME
  )`).run()
  const token = newToken(24)
  const exp = new Date(Date.now() + 1000*60*30).toISOString() // 30 min
  db.prepare('INSERT INTO signup_tokens (token, email, expires) VALUES (?, ?, ?)').run(token, email, exp)
  db.close()
  // 실제 메일 발송 대신 토큰 반환(개발용)
  return { ok: true, token, verifyUrl: `/member/signup?token=${token}` }
})
