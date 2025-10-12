import Database from 'better-sqlite3'
import { readBody, setResponseStatus, setCookie } from 'h3'
import { hashPassword, newToken } from '../../utils/auth'
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = (body?.token || '').trim()
  const email = (body?.email || '').trim().toLowerCase()
  const name = (body?.name || '').trim()
  const pass = body?.password || ''
  const pass2 = body?.password2 || ''
  if (!token || !email || !name || !pass || pass !== pass2) {
    setResponseStatus(event, 400)
    return { message: 'invalid signup payload' }
  }
  const db = new Database('wikidata.db', { fileMustExist: false })
  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    uuid TEXT,
    name TEXT UNIQUE,
    email TEXT UNIQUE,
    isIP BOOLEAN DEFAULT 0,
    isAutoVerifiedUser BOOLEAN DEFAULT 0,
    perms TEXT NOT NULL DEFAULT '[]',
    password TEXT
  )`).run()
  db.prepare(`CREATE TABLE IF NOT EXISTS signup_tokens (
    token TEXT PRIMARY KEY,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires DATETIME
  )`).run()
  const row = db.prepare('SELECT email, expires FROM signup_tokens WHERE token = ?').get(token)
  if (!row || row.email !== email) {
    db.close()
    setResponseStatus(event, 400)
    return { message: 'invalid token' }
  }
  if (row.expires && new Date(row.expires).getTime() < Date.now()) {
    db.close()
    setResponseStatus(event, 400)
    return { message: 'token expired' }
  }
  const hashed = hashPassword(pass)
  try {
    db.prepare('INSERT INTO users (uuid, name, email, perms, password) VALUES (?, ?, ?, ?, ?)')
      .run(randomUUID(), name, email, '[]', hashed)
  } catch (e) {
    db.close()
    setResponseStatus(event, 400)
    return { message: 'user exists' }
  }
  // consume token
  db.prepare('DELETE FROM signup_tokens WHERE token = ?').run(token)

  // auto login: create session
  db.prepare(`CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires DATETIME
  )`).run()
  const sessionToken = newToken(24)
  const exp = new Date(Date.now() + 1000*60*60*24*7).toISOString() // 7 days
  db.prepare('INSERT INTO sessions (token, user_name, expires) VALUES (?, ?, ?)').run(sessionToken, name, exp)
  db.close()
  setCookie(event, 'session_token', sessionToken, { httpOnly: true, sameSite: 'lax', path: '/' })
  return { ok: true }
})
