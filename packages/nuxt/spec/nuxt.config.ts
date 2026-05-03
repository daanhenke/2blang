import { detectVersion } from '@2blang/nuxt-layer/utils/versioning.node'

const v = detectVersion()

export default defineNuxtConfig({
  extends: ['@2blang/nuxt-layer'],
  versioning: { emitManifest: true },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? `/spec/${v.segment}/`,
    head: {
      title: '2blang specification'
    }
  }
})
