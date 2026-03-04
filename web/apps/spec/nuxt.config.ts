export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  modules: ['@nuxt/content'],

  app: {
    baseURL: '/spec/',
  },

  nitro: {
    prerender: {
      // Ignore cross-app links — docs, landing, and downloads are separate apps
      ignore: ['/docs/', '/downloads'],
    },
  },

  routeRules: {
    '/latest': { redirect: { to: '/spec/next/', statusCode: 302 } },
    '/latest/**': { redirect: { to: '/spec/next/**', statusCode: 302 } },
    '/print': { prerender: false },
  },

  compatibilityDate: '2025-03-01',
})
