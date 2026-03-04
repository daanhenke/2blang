import { resolve } from 'node:path'
import { readdirSync } from 'node:fs'

const repoRoot = resolve(import.meta.dirname!, '..', '..', '..')
const versionDir = process.env.CONTENT_VERSION_DIR
const docsDir = versionDir
  ? resolve(import.meta.dirname!, '.content-versions', versionDir, 'docs')
  : resolve(repoRoot, 'docs')

// Derive routes from content .md files
function contentRoutes(): string[] {
  const files = readdirSync(docsDir, { recursive: true })
    .map(f => String(f).replace(/\\/g, '/'))
    .filter(f => f.endsWith('.md'))
  return files.map((f) => {
    const route = f.replace(/\.md$/, '').replace(/\/index$/, '').replace(/^index$/, '')
    return route ? `/${route}` : '/'
  })
}

export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  modules: ['@nuxt/content'],

  app: {
    baseURL: '/docs/',
  },

  nitro: {
    prerender: {
      routes: contentRoutes(),
      crawlLinks: false,
    },
  },

  routeRules: {
    '/latest': { redirect: { to: '/docs/next/', statusCode: 302 } },
    '/latest/**': { redirect: { to: '/docs/next/**', statusCode: 302 } },
  },

  compatibilityDate: '2025-03-01',
})
