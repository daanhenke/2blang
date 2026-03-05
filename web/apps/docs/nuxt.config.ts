const version = process.env.NUXT_PUBLIC_CURRENT_VERSION || 'next'
const sitePrefix = process.env.SITE_PREFIX || ''

export default defineNuxtConfig({
  extends: ['../../packages/shared'],

  modules: ['@nuxt/content'],

  app: {
    baseURL: `${sitePrefix}/docs/${version}/`,
  },

  nitro: {
    prerender: {
      // Crawl all content routes
      crawlLinks: true,
      // Ignore cross-app links the crawler finds in <a> tags
      ignore: [
        /\/spec\//,
        /\/downloads/,
        /\/2blang\/$/,
      ],
      failOnError: false,
    },
  },

  hooks: {
    // Pre-render all docs content pages by adding them as routes
    async 'nitro:config'(nitroConfig) {
      const { resolve } = await import('node:path')
      const { readdirSync, statSync } = await import('node:fs')

      const versionDir = process.env.CONTENT_VERSION_DIR
      const repoRoot = resolve(__dirname, '..', '..', '..')
      const docsDir = versionDir
        ? resolve(__dirname, '.content-versions', versionDir, 'docs')
        : resolve(repoRoot, 'docs')

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

      const routes = collectMdFiles(docsDir)
      nitroConfig.prerender = nitroConfig.prerender || {}
      nitroConfig.prerender.routes = [
        ...(nitroConfig.prerender.routes || []),
        ...routes,
      ]
    },
  },

  compatibilityDate: '2025-03-01',
})
