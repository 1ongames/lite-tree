import { defineEventHandler, getCookie, H3Event } from 'h3'
import { verifyToken } from '../utils/jwt'

export default defineEventHandler((event: H3Event) => {
  try {
    const token = getCookie(event, 'session_token')
    if (!token) return
    const payload = verifyToken(token)
    if (payload && payload.sub) {
      event.context.actorName = payload.sub
    }
  } catch {}
})
