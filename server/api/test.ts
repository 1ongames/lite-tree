import { defineEventHandler, H3Event, getQuery } from 'h3'
import { setAPIError } from '../utils/error'

export default defineEventHandler((event: H3Event) => {
  const { error } = getQuery(event)
  
  if (error === 'true' || error === true) {
    return setAPIError(event, '403')
  }
  
  return {
    hello: 'world',
    test: true
  }
})
