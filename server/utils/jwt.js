import { createHmac, timingSafeEqual } from 'node:crypto'

const textEncoder = new TextEncoder()

function base64url(buf) {
  const b64 = Buffer.isBuffer(buf) ? buf.toString('base64') : Buffer.from(buf).toString('base64')
  return b64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64urlDecode(str) {
  const pad = 4 - (str.length % 4 || 4)
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad)
  return Buffer.from(b64, 'base64')
}

function getSecret() {
  const secret = process.env.SESSION_SECRET || process.env.NUXT_SESSION_SECRET || 'dev-insecure-secret-change-me'
  // Use UTF-8 bytes for HMAC key
  return Buffer.from(secret, 'utf8')
}

export function signToken(payload = {}, ttlSeconds = 60 * 60 * 24 * 7) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + Math.max(1, Math.floor(ttlSeconds))
  const fullPayload = { ...payload, iat, exp }
  const h = base64url(JSON.stringify(header))
  const p = base64url(JSON.stringify(fullPayload))
  const data = `${h}.${p}`
  const hmac = createHmac('sha256', getSecret())
  hmac.update(data)
  const sig = base64url(hmac.digest())
  return `${data}.${sig}`
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string' || token.split('.').length !== 3) return null
  const [h, p, s] = token.split('.')
  // verify signature
  const data = `${h}.${p}`
  const hmac = createHmac('sha256', getSecret())
  hmac.update(data)
  const expected = base64url(hmac.digest())
  try {
    const a = Buffer.from(s)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  // parse payload
  let payload
  try {
    payload = JSON.parse(base64urlDecode(p).toString('utf8'))
  } catch {
    return null
  }
  const now = Math.floor(Date.now() / 1000)
  if (!payload || !payload.exp || now >= payload.exp) return null
  return payload
}
