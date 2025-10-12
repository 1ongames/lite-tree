import { grant_permissions } from '../../publicConfig.json'

export const ALLOWED_PERMS = grant_permissions;

export function sanitizePerms(input) {
  if (!Array.isArray(input)) return []
  const set = new Set()
  for (const p of input) {
    if (typeof p === 'string' && ALLOWED_PERMS.includes(p)) {
      set.add(p)
    }
  }
  return Array.from(set)
}
