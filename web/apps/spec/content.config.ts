import { defineContentConfig, defineCollection } from '@nuxt/content'
import { resolve } from 'node:path'

const repoRoot = resolve(__dirname, '..', '..', '..')
const versionDir = process.env.CONTENT_VERSION_DIR

const specDir = versionDir
  ? resolve(__dirname, '.content-versions', versionDir, 'spec')
  : resolve(repoRoot, 'spec')

export default defineContentConfig({
  collections: {
    spec: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        cwd: specDir,
      },
    }),
  },
})
