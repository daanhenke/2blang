export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  modules: ['@nuxt/content'],

  app: {
    baseURL: `${process.env.NUXT_APP_BASE_URL || ''}/spec/`,
  },

  nitro: {
    prerender: {
      ignore: ['/docs/', '/downloads', '/spec/'],
      failOnError: false,
    },
  },

  routeRules: {
    '/latest': { redirect: { to: '/spec/next/', statusCode: 302 } },
    '/latest/**': { redirect: { to: '/spec/next/**', statusCode: 302 } },
    '/print': { prerender: false },
  },

  compatibilityDate: '2025-03-01',
})
