import crypto from 'crypto'

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const derived = crypto.scryptSync(password, salt, 64)
  const hash = derived.toString('hex')
  return `scrypt:${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || typeof stored !== 'string') return false
  const parts = stored.split(':')
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false
  const [, salt, hash] = parts
  const derived = crypto.scryptSync(password, salt, 64).toString('hex')
  // constant-time compare
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'))
}

export function newToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex')
}
