export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  app: {
    baseURL: '/',
  },

  nitro: {
    prerender: {
      // Ignore cross-app links — docs and spec are separate Nuxt apps
      ignore: ['/docs/', '/spec/'],
    },
  },

  compatibilityDate: '2025-03-01',
})
