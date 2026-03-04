const version = process.env.NUXT_PUBLIC_CURRENT_VERSION || 'next'
const sitePrefix = process.env.SITE_PREFIX || ''

export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  modules: ['@nuxt/content'],

  app: {
    // baseURL is used for routing and asset paths in HTML
    // During prerender, requests are relative (no SITE_PREFIX)
    // After generate, files are deployed to SITE_PREFIX/docs/VERSION/
    baseURL: `/docs/${version}/`,
    // cdnURL overrides just the asset prefix without affecting routing
    ...(sitePrefix ? { cdnURL: `${sitePrefix}/docs/${version}/` } : {}),
  },

  nitro: {
    prerender: {
      ignore: ['/spec/', '/downloads', '/docs/'],
      failOnError: false,
    },
  },

  compatibilityDate: '2025-03-01',
})
