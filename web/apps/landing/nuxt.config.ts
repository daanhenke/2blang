export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  app: {
    baseURL: '/',
  },

  nitro: {
    prerender: {
      routes: ['/', '/downloads'],
      crawlLinks: false,
    },
  },

  compatibilityDate: '2025-03-01',
})
