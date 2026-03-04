import { gitVersioningPlugin } from './vite-plugins/git-versioning'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  vite: {
    plugins: [
      gitVersioningPlugin(),
    ]
  },
})
