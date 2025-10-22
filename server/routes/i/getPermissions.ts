import { defineEventHandler, getQuery, setResponseStatus, H3Event } from 'h3'
import Database from 'better-sqlite3'
import { allowed_perms, all_perms, Permission } from '../../utils/permissions'

export default defineEventHandler((event: H3Event) => {
	const { type } = getQuery(event)
	const actorName = event.context.actorName || ''

	if (!type || (type !== 'grant' && type !== 'all')) {
		setResponseStatus(event, 400)
		return { message: "invalid type." }
	}
	
	if (!actorName) {
		setResponseStatus(event, 403)
		return { message: 'forbidden' }
	}

	try {
		const db = new Database('wikidata.db', { fileMustExist: false })
		const row = db.prepare('SELECT perms FROM users WHERE name = ? LIMIT 1').get(actorName) as { perms: string } | undefined
		db.close()

		let actorPerms: Permission[] = []
		if (row?.perms) {
			try {
				actorPerms = Array.isArray(row.perms) ? row.perms : JSON.parse(row.perms)
			} catch {
				actorPerms = []
			}
		}

		const has = (p: string) => actorPerms.includes(p)

		if (type === 'all') {
			if (has('developer')) {
				return { all_perms: Array.isArray(all_perms) ? all_perms : [] }
			}
			setResponseStatus(event, 403)
			return { message: 'forbidden' }
		}

		// type === 'grant'
		if (has('developer') || has('grant')) {
			return { allowed_perms: Array.isArray(allowed_perms) ? allowed_perms : [] }
		}
		setResponseStatus(event, 403)
		return { message: 'forbidden' }
	} catch (e) {
		setResponseStatus(event, 500)
		return { message: 'server error' }
	}
})
