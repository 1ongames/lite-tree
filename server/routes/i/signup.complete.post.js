import Database from 'better-sqlite3'
import { readBody, setResponseStatus, setCookie } from 'h3'
import { hashPassword } from '../../utils/auth'
import { signToken } from '../../utils/jwt'
import { randomUUID } from 'node:crypto'
import { autologin_date } from '../../../serverConfig.json'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = (body?.token || '').trim()
  const email = (body?.email || '').trim().toLowerCase()
  const name = (body?.name || '').trim()
  const pass = body?.password || ''
  const pass2 = body?.password2 || ''
  if (!token || !email || !name || !pass || pass !== pass2) {
    setResponseStatus(event, 400)
    return { message: '잘못된 가입 요청' }
  }
  // 비밀번호 기본 길이 제한
  if (pass.length < 8) {
    setResponseStatus(event, 400)
    return { message: '비밀번호가 너무 짧습니다.' }
  }
  const db = new Database('wikidata.db', { fileMustExist: false })

  const row = db.prepare('SELECT email, expires FROM signup_tokens WHERE token = ?').get(token)
  if (!row || row.email !== email) {
    db.close()
    setResponseStatus(event, 400)
    return { message: '토큰이 잘못되었습니다.' }
  }
  // 토큰 만료인지 확인
  if (row.expires && new Date(row.expires).getTime() < Date.now()) {
    db.close()
    setResponseStatus(event, 400)
    return { message: '토큰이 만료되었습니다.' }
  }
  const hashed = hashPassword(pass)
  // 사용자 중복 확인
  try {
    db.prepare('INSERT INTO users (uuid, name, email, perms, password) VALUES (?, ?, ?, ?, ?)')
      .run(randomUUID(), name, email, '[]', hashed)
  } catch (e) {
    db.close()
    setResponseStatus(event, 400)
    return { message: '이미 존재하는 사용자입니다.' }
  }

  // 토큰 삭제
  db.prepare('DELETE FROM signup_tokens WHERE token = ?').run(token)

  // 자동 로그인 (JWT)
  const ttlSec = 60*60*24*autologin_date // 기본값 7일, 수정시 autologin_date일
  const jwt = signToken({ sub: name }, ttlSec)
  db.close()
  const isProd = process.env.NODE_ENV === 'production'
  const expires = new Date(Date.now() + ttlSec * 1000)
  setCookie(event, 'session_token', jwt, { httpOnly: true, sameSite: 'lax', path: '/', secure: isProd, expires })
  return { ok: true }
})
