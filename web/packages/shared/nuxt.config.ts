import { resolve } from 'node:path'

const layerDir = resolve(import.meta.dirname!)

export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
  ],

  unocss: {
    nuxtLayers: true,
  },

  css: [
    resolve(layerDir, 'assets/css/main.css'),
    resolve(layerDir, 'assets/css/railroad.css'),
  ],

  components: [
    { path: resolve(layerDir, 'components'), prefix: '' },
  ],

  imports: {
    dirs: [resolve(layerDir, 'composables')],
  },

  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      currentVersion: process.env.NUXT_PUBLIC_CURRENT_VERSION || 'next',
      currentVersionType: process.env.NUXT_PUBLIC_CURRENT_VERSION_TYPE || 'next',
      sitePrefix: process.env.SITE_PREFIX || '',
    },
  },

  compatibilityDate: '2025-03-01',
})
