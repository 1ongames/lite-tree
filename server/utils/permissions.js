import { grant_permissions } from '../../serverConfig.json'

export const allowed_perms = grant_permissions;
export const all_perms = [
    'member',
    'auto_verified_member',
    'developer',
    'nsacl',
    'admin',
    'config',
    'delete_thread',
    'aclgroup',
    'hideip',
    'aclgroup_hidelog',
    'no_force_captcha',
    'skip_captcha',
    'manage_thread',
    'grant',
    'login_history',
    'api_access',
    'hide_document_history_log',
    'hide_revision',
    'mark_troll_revision',
    'batch_revert',
    'edit_protected_file',
    'disable_two_factor_login',
    'grant_hidelog',
    'login_history_hidelog',
    'batch_revert_hidelog',
    'manage_account'
]

export function sanitizePerms(input) {
    if (!Array.isArray(input)) return []
    const set = new Set()
    for (const p of input) {
        if (typeof p === 'string' && allowed_perms.includes(p)) {
            set.add(p)
        }
    }
  return Array.from(set)
}
