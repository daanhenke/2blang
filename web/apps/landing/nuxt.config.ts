export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  app: {
    baseURL: '/',
  },

  nitro: {
    prerender: {
      ignore: ['/docs/', '/spec/'],
      failOnError: false,
    },
  },

  compatibilityDate: '2025-03-01',
})
