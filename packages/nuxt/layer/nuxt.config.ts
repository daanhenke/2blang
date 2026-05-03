import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { detectVersion } from './utils/versioning.node'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '../../..')
const uiDir = resolve(here, '../../libraries/ui')

const detected = detectVersion()
const pdfMode = process.env.NUXT_PUBLIC_2BLANG_PDF_MODE === '1'
// Optional URL prefix (e.g. `/2blang` for GitHub Pages at user.github.io/2blang).
// Empty in dev and on the real domain — only set during temp deploys.
const basePrefix = (process.env.SITE_BASE_PREFIX ?? '').replace(/\/$/, '')

export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@nuxt/content',
    resolve(here, 'modules/versions')
  ],

  css: ['@unocss/reset/tailwind.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  alias: {
    '~assets': resolve(repoRoot, 'assets'),
    '~content': resolve(repoRoot, 'content')
  },

  components: [
    { path: resolve(here, 'components'), pathPrefix: false },
    { path: resolve(uiDir, 'src/components'), pathPrefix: false, prefix: 'Ui' }
  ],

  imports: {
    dirs: [resolve(here, 'composables')]
  },

  runtimeConfig: {
    public: {
      '2blang': {
        version: detected,
        pdfMode,
        basePrefix
      }
    }
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false
    }
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  compatibilityDate: '2025-01-01'
})
