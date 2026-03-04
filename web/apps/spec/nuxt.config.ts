const version = process.env.NUXT_PUBLIC_CURRENT_VERSION || 'next'

export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  modules: ['@nuxt/content'],

  app: {
    baseURL: `/spec/${version}/`,
  },

  nitro: {
    prerender: {
      ignore: ['/docs/', '/downloads', '/spec/'],
      failOnError: false,
    },
  },

  routeRules: {
    '/print': { prerender: false },
  },

  compatibilityDate: '2025-03-01',
})
