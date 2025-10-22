import { defineEventHandler, H3Event, getQuery } from 'h3'

export default defineEventHandler((event: H3Event) => {
  const { docName } = getQuery(event)
  
  return {
    docName: docName,
    doc: 'true'
  }
})
