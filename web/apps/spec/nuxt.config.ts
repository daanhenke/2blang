export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  modules: ['@nuxt/content'],

  app: {
    baseURL: '/spec/',
  },

  routeRules: {
    '/latest': { redirect: { to: '/spec/next/', statusCode: 302 } },
    '/latest/**': { redirect: { to: '/spec/next/**', statusCode: 302 } },
  },

  compatibilityDate: '2025-03-01',
})
