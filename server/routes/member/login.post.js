import Database from 'better-sqlite3'
import { readBody, setResponseStatus, setCookie } from 'h3'
import { verifyPassword, newToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = (body?.email || '').trim().toLowerCase()
  const password = body?.password || ''
  const remember = !!body?.remember
  if (!email || !password) {
    setResponseStatus(event, 400)
    return { message: 'email and password required' }
  }
  const db = new Database('wikidata.db', { fileMustExist: false })
  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    uuid TEXT,
    name TEXT UNIQUE,
    email TEXT UNIQUE,
    isIP BOOLEAN,
    isAutoVerifiedUser BOOLEAN,
    perms TEXT NOT NULL,
    password TEXT
  )`).run()
  const user = db.prepare('SELECT name, email, password FROM users WHERE email = ? LIMIT 1').get(email)
  if (!user || !verifyPassword(password, user.password)) {
    db.close()
    setResponseStatus(event, 401)
    return { message: 'invalid credentials' }
  }
  db.prepare(`CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires DATETIME
  )`).run()
  const token = newToken(24)
  const ttl = remember ? 1000*60*60*24*30 : 1000*60*60*24*7
  const exp = new Date(Date.now() + ttl).toISOString()
  db.prepare('INSERT INTO sessions (token, user_name, expires) VALUES (?, ?, ?)').run(token, user.name, exp)
  db.close()
  setCookie(event, 'session_token', token, { httpOnly: true, sameSite: 'lax', path: '/' })
  return { ok: true }
})
