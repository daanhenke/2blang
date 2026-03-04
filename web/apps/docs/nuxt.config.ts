export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  modules: ['@nuxt/content'],

  app: {
    baseURL: '/docs/',
  },

  nitro: {
    prerender: {
      // Ignore cross-app links — spec, landing, and downloads are separate apps
      ignore: ['/spec/', '/downloads'],
    },
  },

  routeRules: {
    '/latest': { redirect: { to: '/docs/next/', statusCode: 302 } },
    '/latest/**': { redirect: { to: '/docs/next/**', statusCode: 302 } },
  },

  compatibilityDate: '2025-03-01',
})
