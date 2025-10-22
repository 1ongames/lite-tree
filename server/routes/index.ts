import { defineEventHandler, H3Event, sendRedirect } from 'h3'
import { readFileSync, existsSync } from 'fs'

interface PublicConfig {
  wiki_FrontPage: string
}

export default defineEventHandler((event: H3Event) => {
  let publicConfig: PublicConfig
  
  if (existsSync('publicConfig.json')) {
    publicConfig = JSON.parse(readFileSync('publicConfig.json', 'utf-8'))
  } else if (existsSync('publicConfig.example.json')) {
    publicConfig = JSON.parse(readFileSync('publicConfig.example.json', 'utf-8'))
  } else {
    publicConfig = { wiki_FrontPage: 'FrontPage' }
  }

  return sendRedirect(event, `/w/${encodeURIComponent(publicConfig.wiki_FrontPage)}`, 302)
})
