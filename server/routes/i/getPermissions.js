import { getQuery, setResponseStatus } from 'h3'
import Database from 'better-sqlite3'
import { allowed_perms, all_perms } from '../../utils/permissions'

export default defineEventHandler((event) => {
	const { type } = getQuery(event)
	const actorName = event.context.actorName || ''

	if (!type || (type !== 'grant' && type !== 'all')) {
		setResponseStatus(event, 400)
		return { message: "invalid type. use 'grant' or 'all'" }
	}
		if (!actorName) {
		setResponseStatus(event, 403)
		return { message: 'forbidden: missing actor' }
	}

	try {
		const db = new Database('wikidata.db', { fileMustExist: false })
		db.prepare(`CREATE TABLE IF NOT EXISTS users (
			uuid TEXT,
			name TEXT,
			email TEXT,
			isIP BOOLEAN,
			isAutoVerifiedUser BOOLEAN,
			perms TEXT NOT NULL CHECK (json_valid(perms) AND json_type(perms, '$') = 'array')
		)`).run()
		const row = db.prepare('SELECT perms FROM users WHERE name = ? LIMIT 1').get(actorName)
		db.close()

		let actorPerms = []
		if (row?.perms) {
			try {
				actorPerms = Array.isArray(row.perms) ? row.perms : JSON.parse(row.perms)
			} catch {
				actorPerms = []
			}
		}

		const has = (p) => actorPerms.includes(p)

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

