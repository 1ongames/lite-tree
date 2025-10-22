import { H3Event, setResponseStatus } from 'h3'

export type ErrorCode = '400' | '403' | '404' | '404_thr' | '404_doc' | '409' | '429' | '500'

// 에러 메시지
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
	'400': '잘못된 요청입니다.',
	'403': '권한이 부족합니다.',
	'404': '요청한 리소스를 찾을 수 없습니다.',
	'404_thr': '토론이 존재하지 않습니다.',
	'404_doc': '문서를 찾을 수 없습니다.',
	'409': '충돌이 발생했습니다.',
	'429': '요청이 너무 많습니다. 잠시 후 다시 시도하세요.',
	'500': '서버 오류가 발생했습니다.',
}

// http 코드
export const STATUS_BY_CODE: Record<ErrorCode, number> = {
	'400': 400,
	'403': 403,
	'404': 404,
	'404_thr': 404,
	'404_doc': 404,
	'409': 409,
	'429': 429,
	'500': 500,
}

// 메시지
export function getErrorMessage(code: ErrorCode | string, fallback: string = '오류가 발생했습니다.'): string {
	return (code && ERROR_MESSAGES[code as ErrorCode]) || fallback
}

// api 반환
export function setAPIError(event: H3Event, code: ErrorCode): { status: string } {
	const returnCode = STATUS_BY_CODE[code] ?? 400
	const status = ERROR_MESSAGES[code] ?? "오류가 발생했습니다."
	try { setResponseStatus(event, returnCode) } catch {}
	return { status }
}

// 오류 반환
export function setError(code: ErrorCode): { code: ErrorCode; title: string; message: string } {
	const message = getErrorMessage(code)
	return { code, title: '오류', message }
}
