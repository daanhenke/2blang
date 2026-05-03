import { detectVersion } from '@2blang/nuxt-layer/utils/versioning.node'

const v = detectVersion()
const prefix = (process.env.SITE_BASE_PREFIX ?? '').replace(/\/$/, '')

export default defineNuxtConfig({
  extends: ['@2blang/nuxt-layer'],
  versioning: { emitManifest: true },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? `${prefix}/docs/${v.segment}/`,
    head: {
      title: '2blang docs'
    }
  }
})
