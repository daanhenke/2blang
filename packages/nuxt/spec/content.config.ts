import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineCollection, defineContentConfig } from '@nuxt/content'

const here = dirname(fileURLToPath(import.meta.url))
const contentDir = resolve(here, '../../../content/spec')

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        cwd: contentDir
      }
    })
  }
})
