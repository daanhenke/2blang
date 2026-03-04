import { execSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const scriptDir = import.meta.dirname!

export interface VersionEntry {
  id: string
  type: 'release' | 'release-candidate' | 'next'
  label: string
  gitRef: string
  path: string
}

export interface VersionManifest {
  latest: string
  current: { id: string, type: VersionEntry['type'] }
  versions: VersionEntry[]
}

function git(cmd: string, cwd: string): string {
  return execSync(`git ${cmd}`, { cwd, encoding: 'utf-8' }).trim()
}

function parseVersion(versionStr: string): { major: number, minor: number, patch: number, rc?: number } {
  // Parse "v1.0", "v1.1", "v1.1-rc1", etc.
  const match = versionStr.match(/^v?(\d+)\.(\d+)(?:\.(\d+))?(?:-rc(\d+))?$/)
  if (!match) return { major: 0, minor: 0, patch: 0 }
  return {
    major: Number.parseInt(match[1]!, 10),
    minor: Number.parseInt(match[2]!, 10),
    patch: Number.parseInt(match[3] || '0', 10),
    rc: match[4] ? Number.parseInt(match[4], 10) : undefined,
  }
}

function compareVersions(a: string, b: string): number {
  const va = parseVersion(a)
  const vb = parseVersion(b)
  if (va.major !== vb.major) return vb.major - va.major
  if (va.minor !== vb.minor) return vb.minor - va.minor
  if (va.patch !== vb.patch) return vb.patch - va.patch
  // RCs sort after releases of the same version
  if (va.rc === undefined && vb.rc !== undefined) return -1
  if (va.rc !== undefined && vb.rc === undefined) return 1
  if (va.rc !== undefined && vb.rc !== undefined) return vb.rc - va.rc
  return 0
}

function resolveCurrentVersion(repoRoot: string): { id: string, type: VersionEntry['type'] } {
  // Check if HEAD is at a tag
  try {
    const tag = git('describe --tags --exact-match HEAD', repoRoot)
    if (tag.startsWith('releases/')) {
      return { id: tag.replace('releases/', ''), type: 'release' }
    }
    if (tag.startsWith('release-candidates/')) {
      return { id: tag.replace('release-candidates/', ''), type: 'release-candidate' }
    }
  }
  catch {
    // Not on a tag
  }

  // Default to "next"
  return { id: 'next', type: 'next' }
}

export function generateManifest(repoRoot: string): VersionManifest {
  const versions: VersionEntry[] = []

  // Collect release tags
  try {
    const releaseTags = git('tag -l "releases/*"', repoRoot)
    if (releaseTags) {
      for (const tag of releaseTags.split('\n').filter(Boolean)) {
        const id = tag.replace('releases/', '')
        versions.push({
          id,
          type: 'release',
          label: id,
          gitRef: tag,
          path: `/docs/${id}/`,
        })
      }
    }
  }
  catch { /* no tags */ }

  // Collect RC tags
  try {
    const rcTags = git('tag -l "release-candidates/*"', repoRoot)
    if (rcTags) {
      for (const tag of rcTags.split('\n').filter(Boolean)) {
        const id = tag.replace('release-candidates/', '')
        versions.push({
          id,
          type: 'release-candidate',
          label: id,
          gitRef: tag,
          path: `/docs/${id}/`,
        })
      }
    }
  }
  catch { /* no tags */ }

  // Add "next" from master branch
  versions.push({
    id: 'next',
    type: 'next',
    label: 'next (dev)',
    gitRef: 'master',
    path: '/docs/next/',
  })

  // Sort: releases first (desc by version), then RCs (desc), then next
  versions.sort((a, b) => {
    const typeOrder: Record<string, number> = { release: 0, 'release-candidate': 1, next: 2 }
    const typeA = typeOrder[a.type] ?? 3
    const typeB = typeOrder[b.type] ?? 3
    if (typeA !== typeB) return typeA - typeB
    return compareVersions(a.id, b.id)
  })

  // Latest is the highest-versioned release
  const latestRelease = versions.find(v => v.type === 'release')
  const latest = latestRelease?.id || 'next'

  const current = resolveCurrentVersion(repoRoot)

  return { latest, current, versions }
}

// CLI entry point
if (process.argv[1]?.endsWith('version-manifest.ts') || process.argv[1]?.endsWith('version-manifest.js')) {
  const repoRoot = resolve(scriptDir, '..', '..')
  const manifest = generateManifest(repoRoot)

  // Write to all app public dirs
  const targets = [
    resolve(scriptDir, '..', 'apps', 'docs', 'public'),
    resolve(scriptDir, '..', 'apps', 'spec', 'public'),
    resolve(scriptDir, '..', 'apps', 'landing', 'public'),
  ]

  for (const dir of targets) {
    mkdirSync(dir, { recursive: true })
    writeFileSync(resolve(dir, 'version-manifest.json'), JSON.stringify(manifest, null, 2))
  }

  console.log('Version manifest generated:')
  console.log(JSON.stringify(manifest, null, 2))
}
