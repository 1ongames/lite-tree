import { defineEventHandler, H3Event, getCookie, setResponseStatus } from 'h3'
import { verifyToken } from '../../utils/jwt'
import Database from 'better-sqlite3'

export default defineEventHandler((event: H3Event) => {
  const token = getCookie(event, 'session_token')
  
  if (!token) {
    setResponseStatus(event, 401)
    return { user: null }
  }

  const payload = verifyToken(token)
  
  if (!payload || !payload.sub) {
    setResponseStatus(event, 401)
    return { user: null }
  }

  try {
    const db = new Database('wikidata.db', { fileMustExist: false })
    const user = db.prepare('SELECT name, email FROM users WHERE name = ? LIMIT 1').get(payload.sub) as { name: string; email: string } | undefined
    db.close()

    if (!user) {
      setResponseStatus(event, 401)
      return { user: null }
    }

    return {
      user: {
        name: user.name,
        email: user.email
      }
    }
  } catch (error) {
    setResponseStatus(event, 500)
    return { user: null }
  }
})
