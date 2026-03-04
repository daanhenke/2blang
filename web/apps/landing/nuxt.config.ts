export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  app: {
    baseURL: `${process.env.NUXT_APP_BASE_URL || ''}/`,
  },

  nitro: {
    prerender: {
      ignore: ['/docs/', '/spec/'],
      failOnError: false,
    },
  },

  compatibilityDate: '2025-03-01',
})
