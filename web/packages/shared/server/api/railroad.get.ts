import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineEventHandler, getQuery, createError } from 'h3'
import { renderRule, listRules } from '../../utils/ebnf-to-railroad'

/**
 * Try to find the repo root by walking up from cwd looking for pnpm-workspace.yaml
 */
function findRepoRoot(): string {
  let dir = process.cwd()
  for (let i = 0; i < 10; i++) {
    if (existsSync(resolve(dir, 'pnpm-workspace.yaml'))) {
      return dir
    }
    const parent = resolve(dir, '..')
    if (parent === dir) break
    dir = parent
  }
  // Fallback: assume 3 levels up from app dir
  return resolve(process.cwd(), '..', '..', '..')
}

const repoRoot = findRepoRoot()

export default defineEventHandler((event) => {
  const query = getQuery(event) as { file?: string, rule?: string, list?: string }

  if (!query.file) {
    throw createError({ statusCode: 400, statusMessage: 'Missing "file" query parameter' })
  }

  // Sanitize file path — only allow filenames, no directory traversal
  const filename = query.file.replace(/[^a-zA-Z0-9._-]/g, '')
  if (filename !== query.file) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file name' })
  }

  // Resolve from REPO_ROOT/assets/
  const grammarPath = resolve(repoRoot, 'assets', filename)
  let grammarSource: string
  try {
    grammarSource = readFileSync(grammarPath, 'utf-8')
  }
  catch {
    throw createError({ statusCode: 404, statusMessage: `Grammar file "${filename}" not found in ${grammarPath}` })
  }

  // List mode: return available rules
  if (query.list !== undefined) {
    return listRules(grammarSource)
  }

  // Render mode: return SVG for a specific rule
  if (!query.rule) {
    throw createError({ statusCode: 400, statusMessage: 'Missing "rule" query parameter' })
  }

  try {
    const svg = renderRule(grammarSource, query.rule)
    // Return as plain text to avoid Nitro trying to serialize non-POJO objects
    event.node.res.setHeader('Content-Type', 'image/svg+xml')
    event.node.res.end(String(svg))
  }
  catch (err: any) {
    throw createError({ statusCode: 400, statusMessage: err.message })
  }
})
