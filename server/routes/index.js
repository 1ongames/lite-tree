import { readFileSync, existsSync } from 'fs'

export default defineEventHandler((event) => {

  let publicConfig
  if (existsSync('publicConfig.json')) {
    publicConfig = JSON.parse(readFileSync('publicConfig.json', 'utf-8'))
  } else if (existsSync('publicConfig.example.json')) {
    publicConfig = JSON.parse(readFileSync('publicConfig.example.json', 'utf-8'))
  } else {
    publicConfig = { wiki_FrontPage: 'FrontPage' }
  }

  return sendRedirect(event, `/w/${encodeURIComponent(publicConfig.wiki_FrontPage)}`, 302)
})