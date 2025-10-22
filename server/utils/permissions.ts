import serverConfig from '../../serverConfig.json' assert { type: 'json' }

export type Permission = string

export const allowed_perms: Permission[] = Array.isArray(serverConfig?.grant_permissions)
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

export const all_perms: Permission[] = [
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

export function grantablePermsByActor(actorPerms: Permission[]): Permission[] {
    const permsArr = Array.isArray(actorPerms) ? actorPerms : []
    if (permsArr.includes('developer')) return all_perms
    if (permsArr.includes('grant')) return allowed_perms
    return []
}

export function sanitizePerms(input: any, actorPerms?: Permission[]): Permission[] {
    if (!Array.isArray(input)) return []

    const set = new Set<string>()
    for (const p of input) {
        if (typeof p === 'string' && all_perms.includes(p)) set.add(p)
    }
    return Array.from(set)
}
