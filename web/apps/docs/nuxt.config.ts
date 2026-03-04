const version = process.env.NUXT_PUBLIC_CURRENT_VERSION || 'next'

export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  modules: ['@nuxt/content'],

  app: {
    baseURL: `/docs/${version}/`,
  },

  nitro: {
    prerender: {
      ignore: ['/spec/', '/downloads', '/docs/'],
      failOnError: false,
    },
  },

  compatibilityDate: '2025-03-01',
})
