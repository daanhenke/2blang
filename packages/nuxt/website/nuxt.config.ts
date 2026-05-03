export default defineNuxtConfig({
  extends: ['@2blang/nuxt-layer'],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/',
    head: {
      title: '2blang'
    }
  }
})
