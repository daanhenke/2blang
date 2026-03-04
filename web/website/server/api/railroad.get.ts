import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

import { ebnfToSvg } from '../../app/utils/ebnf-railroad'

export default defineEventHandler(async (event) => {
  const { file, rule } = getQuery(event)

  if (!file || !rule) {
    throw createError({ statusCode: 400, statusMessage: 'Missing file or rule query parameter' })
  }

  const filePath = resolve('content', String(file))

  // Prevent directory traversal
  if (!filePath.startsWith(resolve('content'))) {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  let content: string
  try {
    content = await readFile(filePath, 'utf-8')
  } catch {
    throw createError({ statusCode: 404, statusMessage: `File not found: ${file}` })
  }

  try {
    const svg = ebnfToSvg(content, String(rule))
    return { svg }
  } catch (e) {
    throw createError({ statusCode: 400, statusMessage: (e as Error).message })
  }
})
