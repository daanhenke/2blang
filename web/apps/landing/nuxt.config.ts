const sitePrefix = process.env.SITE_PREFIX || ''

export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  app: {
    baseURL: `${sitePrefix}/`,
  },

  nitro: {
    prerender: {
      ignore: ['/docs/', '/spec/'],
      failOnError: false,
    },
  },

  compatibilityDate: '2025-03-01',
})
