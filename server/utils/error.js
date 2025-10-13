import { setResponseStatus } from 'h3'

// 에러 메시지
export const ERROR_MESSAGES = {
	'400': '잘못된 요청입니다.',
	'403': '권한이 부족합니다.',
	'404': '요청한 리소스를 찾을 수 없습니다.',
	'404_doc': '문서를 찾을 수 없습니다.',
	'409': '충돌이 발생했습니다.',
	'429': '요청이 너무 많습니다. 잠시 후 다시 시도하세요.',
	'500': '서버 오류가 발생했습니다.',
}

// http 코드
export const STATUS_BY_CODE = {
	'400': 400,
	'403': 403,
	'404': 404,
	'404_doc': 404,
	'409': 409,
	'429': 429,
	'500': 500,
}

// 메시지
export function getErrorMessage(code, fallback = '오류가 발생했습니다.') {
	return (code && ERROR_MESSAGES[code]) || fallback
}

// api 반환
export function respondErrorByCode(event, code) {
	const status = STATUS_BY_CODE[code] ?? 400
	const message = getErrorMessage(code)
	try { setResponseStatus(event, status) } catch {}
	return { code, message }
}

// 오류 반환
export function setError(code) {
	const message = getErrorMessage(code)
	return { code, title: '오류', message }
}