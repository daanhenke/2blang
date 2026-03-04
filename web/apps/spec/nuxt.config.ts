const version = process.env.NUXT_PUBLIC_CURRENT_VERSION || 'next'
const sitePrefix = process.env.SITE_PREFIX || ''

export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  modules: ['@nuxt/content'],

  app: {
    baseURL: `${sitePrefix}/spec/${version}/`,
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
