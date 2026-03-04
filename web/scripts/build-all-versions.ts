import { execSync } from 'node:child_process'
import { resolve, join } from 'node:path'
import { mkdirSync, cpSync, existsSync, writeFileSync } from 'node:fs'
import { generateManifest } from './version-manifest'
import { extractContent } from './copy-content'

const repoRoot = resolve(import.meta.dirname!, '..', '..')
const distRoot = resolve(repoRoot, 'dist')

const manifest = generateManifest(repoRoot)

console.log('Building ALL versions for deployment')
console.log(`Found ${manifest.versions.length} versions:`)
manifest.versions.forEach(v => console.log(`  - ${v.id} (${v.type}) [${v.gitRef}]`))
console.log()

// Write manifest to all app public dirs
for (const app of ['docs', 'spec', 'landing'] as const) {
  const publicDir = resolve(repoRoot, 'web', 'apps', app, 'public')
  mkdirSync(publicDir, { recursive: true })
  writeFileSync(
    resolve(publicDir, 'version-manifest.json'),
    JSON.stringify(manifest, null, 2),
  )
}

function run(cmd: string, cwd: string, extraEnv?: Record<string, string>) {
  console.log(`> ${cmd}`)
  execSync(cmd, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096', ...extraEnv },
  })
}

// Clean dist
mkdirSync(distRoot, { recursive: true })

// 1. Build landing (versionless)
console.log('\n=== Building landing ===')
run('npx nuxt generate', resolve(repoRoot, 'web', 'apps', 'landing'))
// nuxt generate always outputs flat to .output/public/ regardless of baseURL
const landingOutput = resolve(repoRoot, 'web', 'apps', 'landing', '.output', 'public')
if (existsSync(landingOutput)) {
  cpSync(landingOutput, distRoot, { recursive: true })
}

// 2. Build each version for docs + spec
for (const version of manifest.versions) {
  console.log(`\n=== Building version: ${version.id} (${version.type}) ===`)

  const buildEnv: Record<string, string> = {
    NUXT_PUBLIC_CURRENT_VERSION: version.id,
    NUXT_PUBLIC_CURRENT_VERSION_TYPE: version.type,
  }

  // Extract content from git ref (unless it's "next" on current branch)
  if (version.type !== 'next') {
    extractContent(repoRoot, version.gitRef, version.id, 'docs')
    extractContent(repoRoot, version.gitRef, version.id, 'spec')
    buildEnv.CONTENT_VERSION_DIR = version.id
  }

  // Build docs for this version
  const docsDir = resolve(repoRoot, 'web', 'apps', 'docs')
  run('npx nuxt generate', docsDir, buildEnv)
  const docsOutput = resolve(docsDir, '.output', 'public')
  if (existsSync(docsOutput)) {
    const target = join(distRoot, 'docs', version.id)
    mkdirSync(target, { recursive: true })
    cpSync(docsOutput, target, { recursive: true })
  }

  // Build spec for this version
  const specDir = resolve(repoRoot, 'web', 'apps', 'spec')
  run('npx nuxt generate', specDir, buildEnv)
  const specOutput = resolve(specDir, '.output', 'public')
  if (existsSync(specOutput)) {
    const target = join(distRoot, 'spec', version.id)
    mkdirSync(target, { recursive: true })
    cpSync(specOutput, target, { recursive: true })
  }
}

// 3. Create redirect for /docs/latest -> /docs/<latest>/
const baseUrl = process.env.SITE_PREFIX || ''

const latestRedirectHtml = `<!DOCTYPE html>
<html>
<head><meta http-equiv="refresh" content="0;url=${baseUrl}/docs/${manifest.latest}/"></head>
<body>Redirecting to <a href="${baseUrl}/docs/${manifest.latest}/">latest docs</a>...</body>
</html>`
mkdirSync(join(distRoot, 'docs', 'latest'), { recursive: true })
writeFileSync(join(distRoot, 'docs', 'latest', 'index.html'), latestRedirectHtml)

// Same for spec
const latestSpecRedirect = `<!DOCTYPE html>
<html>
<head><meta http-equiv="refresh" content="0;url=${baseUrl}/spec/${manifest.latest}/"></head>
<body>Redirecting to <a href="${baseUrl}/spec/${manifest.latest}/">latest spec</a>...</body>
</html>`
mkdirSync(join(distRoot, 'spec', 'latest'), { recursive: true })
writeFileSync(join(distRoot, 'spec', 'latest', 'index.html'), latestSpecRedirect)

console.log('\n=== All versions built successfully ===')
console.log(`Output: ${distRoot}`)
