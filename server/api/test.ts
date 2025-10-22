import { defineEventHandler, H3Event } from 'h3'

export default defineEventHandler((event: H3Event) => {
  return {
    hello: 'world',
    test: true
  }
})
