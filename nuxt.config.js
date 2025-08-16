// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
/*  routeRules: {
    '/**': { ssr: false }
  }, */
  css: [ '@/assets/styles/recent.css' ],
  modules: [
    '@pinia/nuxt',
  ]
}
