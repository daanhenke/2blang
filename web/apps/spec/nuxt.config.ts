const version = process.env.NUXT_PUBLIC_CURRENT_VERSION || 'next'
const sitePrefix = process.env.SITE_PREFIX || ''

export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  modules: ['@nuxt/content'],

  app: {
    baseURL: `${sitePrefix}/spec/${version}/`,
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      ignore: [
        /\/docs\//,
        /\/downloads/,
        /\/2blang\/$/,
      ],
      failOnError: false,
    },
  },

  hooks: {
    async 'nitro:config'(nitroConfig: any) {
      const { resolve } = await import('node:path')
      const { readdirSync, statSync } = await import('node:fs')

      const versionDir = process.env.CONTENT_VERSION_DIR
      const repoRoot = resolve(__dirname, '..', '..', '..')
      const specDir = versionDir
        ? resolve(__dirname, '.content-versions', versionDir, 'spec')
        : resolve(repoRoot, 'spec')

      function collectMdFiles(dir: string, prefix = ''): string[] {
        const routes: string[] = []
        try {
          for (const entry of readdirSync(dir)) {
            const full = resolve(dir, entry)
            const stat = statSync(full)
            if (stat.isDirectory()) {
              routes.push(...collectMdFiles(full, `${prefix}/${entry}`))
            }
            else if (entry.endsWith('.md')) {
              const slug = entry === 'index.md' ? '' : `/${entry.replace(/\.md$/, '')}`
              routes.push(`${prefix}${slug}` || '/')
            }
          }
        }
        catch { /* dir might not exist */ }
        return routes
      }

      const routes = collectMdFiles(specDir)
      nitroConfig.prerender = nitroConfig.prerender || {}
      nitroConfig.prerender.routes = [
        ...(nitroConfig.prerender.routes || []),
        ...routes,
      ]
    },
  },

  routeRules: {
    '/print': { prerender: false },
  },

  compatibilityDate: '2025-03-01',
})
