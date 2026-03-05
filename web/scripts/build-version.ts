import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import { extractContent } from './copy-content'
import { generateManifest } from './version-manifest'

/**
 * Build a single version of docs and spec.
 * Usage: build-version.ts [gitRef]
 *
 * If no gitRef is given, builds the current working tree as "next".
 */
const repoRoot = resolve(import.meta.dirname!, '..', '..')
// Filter out '--' which pnpm passes through as an arg separator
const gitRef = process.argv.slice(2).filter(a => a !== '--')[0]

const manifest = generateManifest(repoRoot)

// Determine version from ref
let versionId: string
let versionType: string

if (!gitRef) {
  // Build current working tree as "next"
  versionId = 'next'
  versionType = 'next'
}
else if (gitRef.startsWith('releases/')) {
  versionId = gitRef.replace('releases/', '')
  versionType = 'release'
}
else if (gitRef.startsWith('release-candidates/')) {
  versionId = gitRef.replace('release-candidates/', '')
  versionType = 'release-candidate'
}
else {
  versionId = 'next'
  versionType = 'next'
}

const env = {
  ...process.env,
  NUXT_PUBLIC_CURRENT_VERSION: versionId,
  NUXT_PUBLIC_CURRENT_VERSION_TYPE: versionType,
}

function run(cmd: string, cwd: string) {
  console.log(`> ${cmd} (in ${cwd})`)
  execSync(cmd, { cwd, stdio: 'inherit', env: { ...env, NODE_OPTIONS: '--max-old-space-size=4096' } })
}

console.log(`\nBuilding version: ${versionId} (${versionType}) from ref: ${gitRef || 'working tree'}\n`)

// If building from a git ref (not working tree), extract content
if (gitRef) {
  extractContent(repoRoot, gitRef, versionId, 'docs')
  extractContent(repoRoot, gitRef, versionId, 'spec')
  env.CONTENT_VERSION_DIR = versionId
}

// Write manifest to public dirs
import { writeFileSync, mkdirSync } from 'node:fs'

for (const app of ['docs', 'spec', 'landing'] as const) {
  const publicDir = resolve(repoRoot, 'web', 'apps', app, 'public')
  mkdirSync(publicDir, { recursive: true })
  writeFileSync(
    resolve(publicDir, 'version-manifest.json'),
    JSON.stringify(manifest, null, 2),
  )
}

// Generate docs
console.log('\n--- Building docs ---')
run('npx nuxt generate', resolve(repoRoot, 'web', 'apps', 'docs'))

// Generate spec
console.log('\n--- Building spec ---')
run('npx nuxt generate', resolve(repoRoot, 'web', 'apps', 'spec'))

console.log(`\nVersion ${versionId} built successfully.`)
