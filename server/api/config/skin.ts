import { defineEventHandler, H3Event } from 'h3'
import serverConfig from '../../../serverConfig.json' assert { type: 'json' }

export default defineEventHandler((event: H3Event) => {
  return {
    default_skin: serverConfig.default_skin || 'normal'
  }
})
