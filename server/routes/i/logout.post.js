import { setCookie } from 'h3'

export default defineEventHandler((event) => {
  const isProd = process.env.NODE_ENV === 'production'
  setCookie(event, 'session_token', '', { httpOnly: true, path: '/', sameSite: 'lax', secure: isProd, maxAge: 0 })
  return { ok: true }
})
