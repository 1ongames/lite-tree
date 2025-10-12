import serverConfig from '../../serverConfig.json' assert { type: 'json' }

export const allowed_perms = Array.isArray(serverConfig?.grant_permissions)
    ? serverConfig.grant_permissions
    : [    
    "nsacl",
    "admin",
    "delete_thread",
    "aclgroup",
    "no_force_captcha",
    "manage_thread",
    "grant",
    "login_history",
    "api_access",
    "hide_document_history_log",
    "hide_revision",
    "mark_troll_revision",
    "batch_revert",
    "disable_two_factor_login"
]
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

export function grantablePermsByActor(actorPerms) {
    const permsArr = Array.isArray(actorPerms) ? actorPerms : []
    if (permsArr.includes('developer')) return all_perms
    if (permsArr.includes('grant')) return allowed_perms
    return []
}

export function sanitizePerms(input, actorPerms) {
    if (!Array.isArray(input)) return []
    // actorPerms가 주어지면 actor 수준에 맞는 허용 목록을 사용, 없으면 하위호환으로 allowed_perms 사용
    const allowed = Array.isArray(actorPerms) ? grantablePermsByActor(actorPerms) : allowed_perms
    if (!allowed.length) return []
    const set = new Set()
    for (const p of input) {
        if (typeof p === 'string' && allowed.includes(p)) set.add(p)
    }
    return Array.from(set)
}
