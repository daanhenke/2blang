import { defineContentConfig, defineCollection } from '@nuxt/content'
import { resolve } from 'node:path'

const repoRoot = resolve(__dirname, '..', '..', '..')
const versionDir = process.env.CONTENT_VERSION_DIR

const docsDir = versionDir
  ? resolve(__dirname, '.content-versions', versionDir, 'docs')
  : resolve(repoRoot, 'docs')

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        cwd: docsDir,
      },
    }),
  },
})
