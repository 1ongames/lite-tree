import { defineEventHandler, H3Event, getQuery } from 'h3'
import { respondErrorByCode } from '../utils/error'

export default defineEventHandler((event: H3Event) => {
  const { error } = getQuery(event)
  
  if (error === 'true' || error === true) {
    return respondErrorByCode(event, '500')
  }
  
  return {
    hello: 'world',
    test: true
  }
})
