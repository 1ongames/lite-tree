import Database from 'better-sqlite3'
import { readBody, setResponseStatus, setCookie } from 'h3'
import { verifyPassword } from '../../utils/auth'
import { signToken } from '../../utils/jwt'

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
  // JWT 기반 무상태 세션 토큰 발급
  const ttlSec = remember ? 60*60*24*30 : 60*60*24*7
  const jwt = signToken({ sub: user.name }, ttlSec)
  db.close()
  const isProd = process.env.NODE_ENV === 'production'
  const expires = new Date(Date.now() + ttlSec * 1000)
  setCookie(event, 'session_token', jwt, { httpOnly: true, sameSite: 'lax', path: '/', secure: isProd, expires })
  return { ok: true }
})
