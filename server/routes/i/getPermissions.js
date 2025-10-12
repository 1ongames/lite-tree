import { getQuery, setResponseStatus } from 'h3'
import { allowed_perms, all_perms } from '../../utils/permissions'

export default defineEventHandler((event) => {
	const { type } = getQuery(event)

	if (type === 'grant') {
		return { allowed_perms: Array.isArray(allowed_perms) ? allowed_perms : [] }
	}
	if (type === 'all') {
		return { all_perms: Array.isArray(all_perms) ? all_perms : [] }
	}

	setResponseStatus(event, 400)
	return { message: "invalid type" }
})

