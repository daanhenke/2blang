import { execSync } from 'node:child_process'
import { mkdirSync, existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Extract content from a specific git ref into .content-versions/<versionId>/
 */
export function extractContent(
  repoRoot: string,
  gitRef: string,
  versionId: string,
  app: 'docs' | 'spec',
) {
  const appDir = resolve(repoRoot, 'web', 'apps', app)
  const outDir = resolve(appDir, '.content-versions', versionId)

  // Clean and recreate output directory
  if (existsSync(outDir)) {
    rmSync(outDir, { recursive: true })
  }
  mkdirSync(outDir, { recursive: true })

  const contentSubdir = app === 'docs' ? 'docs' : 'spec'

  // Extract content using git archive
  // We extract docs/spec content and shared assets
  try {
    const tarCmd = process.platform === 'win32' ? 'tar' : 'tar'

    // Extract the content directory
    execSync(
      `git archive "${gitRef}" -- ${contentSubdir}/ | ${tarCmd} -x -C "${outDir}"`,
      { cwd: repoRoot, stdio: 'pipe' },
    )

    // Extract shared assets
    try {
      execSync(
        `git archive "${gitRef}" -- assets/ | ${tarCmd} -x -C "${outDir}"`,
        { cwd: repoRoot, stdio: 'pipe' },
      )
    }
    catch {
      // assets/ may not exist in older versions
    }

    console.log(`Extracted ${app} content for ${versionId} (ref: ${gitRef}) -> ${outDir}`)
  }
  catch (err: any) {
    console.error(`Failed to extract ${app} content for ${versionId}:`, err.message)
    throw err
  }
}

// CLI entry point
if (process.argv[1]?.endsWith('copy-content.ts') || process.argv[1]?.endsWith('copy-content.js')) {
  const [gitRef, versionId, app] = process.argv.slice(2)
  if (!gitRef || !versionId || !app) {
    console.error('Usage: copy-content.ts <gitRef> <versionId> <docs|spec>')
    process.exit(1)
  }
  const repoRoot = resolve(import.meta.dirname!, '..', '..')
  extractContent(repoRoot, gitRef, versionId, app as 'docs' | 'spec')
}
