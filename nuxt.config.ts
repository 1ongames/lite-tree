// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  routeRules: {
    '/**': { ssr: false }
  },
  css: [ '@/assets/styles/recent.css', '@/assets/styles/auth.css', '@/assets/styles/default.css', '@/assets/styles/admin.css' ],
  modules: [
    '@pinia/nuxt',
  ]
}
