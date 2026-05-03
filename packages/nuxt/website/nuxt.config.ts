const prefix = (process.env.SITE_BASE_PREFIX ?? '').replace(/\/$/, '')

export default defineNuxtConfig({
  extends: ['@2blang/nuxt-layer'],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? `${prefix}/`,
    head: {
      title: '2blang'
    }
  }
})
