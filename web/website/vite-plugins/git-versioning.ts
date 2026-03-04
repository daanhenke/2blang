import { execFileSync, spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

export interface GitVersioningPluginOptions {
  repositoryPath?: string
  releaseTagPrefix?: string
  releaseCandidateTagPrefix?: string
  nextBranch?: string
  nextVersionName?: string
  virtualModuleId?: string
}

export type VersionChannel = 'release' | 'release-candidate' | 'next'

const emittedTypeVersionChannel = `'release' | 'release-candidate' | 'next'`

export interface VersionEntry {
  id: string
  label: string
  gitRef: string
  channel: VersionChannel

  baseVersion?: string
  releaseCandidateNumber?: number

  isDefault: boolean
  isLatestRelease: boolean
  isLatestReleaseCandidate: boolean
}

const emittedTypeVersionEntry = `{
  readonly id: string
  readonly label: string
  readonly gitRef: string
  readonly channel: VersionChannel

  readonly baseVersion?: string
  readonly releaseCandidateNumber?: number

  readonly isDefault: boolean
  readonly isLatestRelease: boolean
  readonly isLatestReleaseCandidate: boolean
}`

export interface VersionsData {
  versions: VersionEntry[]
  releases: VersionEntry[]
  releaseCandidates: VersionEntry[]
  next?: VersionEntry
  defaultVersion?: string
  latestRelease?: string
  latestReleaseCandidate?: string
}

const emittedTypeVersionsData = `{
  readonly versions: readonly VersionEntry[]
  readonly releases: readonly VersionEntry[]
  readonly releaseCandidates: readonly VersionEntry[]
  readonly next?: VersionEntry

  readonly defaultVersion?: string
  readonly latestRelease?: string
  readonly latestReleaseCandidate?: string
}`

const DEFAULTS: Required<GitVersioningPluginOptions> = {
  repositoryPath: process.cwd(),
  releaseTagPrefix: 'releases/',
  releaseCandidateTagPrefix: 'release-candidates/',
  nextBranch: 'next',
  nextVersionName: 'next',
  virtualModuleId: 'git-versioning'
}

export function gitVersioningPlugin(options: GitVersioningPluginOptions = {}): Plugin {
  const config = { ...DEFAULTS, ...options }
  const repositoryPath = resolve(config.repositoryPath)
  const virtualModuleId = `virtual:${config.virtualModuleId}`
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  return {
    name: 'git-versioning',

    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }

      return null
    },

    load(id: string) {
      if (id !== resolvedVirtualModuleId) {
        return null
      }

      const data = readVersions({
        repositoryPath: repositoryPath,
        releaseTagPrefix: config.releaseTagPrefix,
        releaseCandidateTagPrefix: config.releaseCandidateTagPrefix,
        nextBranch: config.nextBranch,
        nextVersionName: config.nextVersionName
      })

      return [
        `const data = ${JSON.stringify(data, null, 2)};`,
        ``,
        `export const versions = data.versions;`,
        `export const releases = data.releases;`,
        `export const releaseCandidates = data.releaseCandidates;`,
        `export const next = data.next;`,
        `export const defaultVersion = data.defaultVersion;`,
        `export const latestRelease = data.latestRelease;`,
        `export const latestReleaseCandidate = data.latestReleaseCandidate;`,
        ``,
        `export default data;`
      ].join('\n')
    }
  }
}

function readVersions(options: {
  repositoryPath: string
  releaseTagPrefix: string
  releaseCandidateTagPrefix: string
  nextBranch: string
  nextVersionName: string
}): VersionsData {
  const allTags = listTags(options.repositoryPath)

  const stableTags = allTags
    .filter(tag => tag.startsWith(options.releaseTagPrefix))
    .map(tag => parseStableTag(tag, options.releaseTagPrefix))
    .filter((x): x is ParsedStableTag => x !== null)
    .sort((a, b) => compareBaseVersionsDesc(a.baseVersion, b.baseVersion))

  const releaseCandidateTags = allTags
    .filter(tag => tag.startsWith(options.releaseCandidateTagPrefix))
    .map(tag => parseReleaseCandidateTag(tag, options.releaseCandidateTagPrefix))
    .filter((x): x is ParsedReleaseCandidateTag => x !== null)
    .sort(compareReleaseCandidatesDesc)

  const latestRelease = stableTags[0]?.baseVersion ?? undefined
  const latestReleaseCandidate = releaseCandidateTags[0] ? `${releaseCandidateTags[0].baseVersion}-rc${releaseCandidateTags[0].releaseCandidateNumber}` : undefined

  const releases: VersionEntry[] = stableTags.map((item, index) => ({
    id: item.baseVersion,
    label: item.baseVersion,
    gitRef: item.tag,
    channel: 'release',
    baseVersion: item.baseVersion,
    isDefault: index === 0,
    isLatestRelease: index === 0,
    isLatestReleaseCandidate: false
  }))

  const releaseCandidates: VersionEntry[] = releaseCandidateTags.map((item, index) => ({
    id: `${item.baseVersion}-rc${item.releaseCandidateNumber}`,
    label: `${item.baseVersion}-rc${item.releaseCandidateNumber}`,
    gitRef: item.tag,
    channel: 'release-candidate',
    baseVersion: item.baseVersion,
    releaseCandidateNumber: item.releaseCandidateNumber,
    isDefault: false,
    isLatestRelease: false,
    isLatestReleaseCandidate: index === 0
  }))

  const next = branchExists(options.repositoryPath, options.nextBranch)
    ? ({
      id: options.nextVersionName,
      label: options.nextVersionName,
      gitRef: options.nextBranch,
      channel: 'next',
      isDefault: false,
      isLatestRelease: false,
      isLatestReleaseCandidate: false
    } satisfies VersionEntry)
    : undefined

  const versions = combineVersions(releases, releaseCandidates, next)

  return {
    versions,
    releases,
    releaseCandidates,
    next,
    defaultVersion: latestRelease,
    latestRelease,
    latestReleaseCandidate
  }
}

function combineVersions(releases: VersionEntry[], releaseCandidates: VersionEntry[], next?: VersionEntry): VersionEntry[] {
  const result: VersionEntry[] = []

  if (next) {
    result.push(next)
  }

  const releasesByBaseVersion = new Map<string, VersionEntry>()
  for (const release of releases) {
    if (release.baseVersion) {
      releasesByBaseVersion.set(release.baseVersion, release)
    }
  }

  const releaseCandidatesByBaseVersion = new Map<string, VersionEntry[]>()
  for (const rc of releaseCandidates) {
    if (rc.baseVersion) {
      const list = releaseCandidatesByBaseVersion.get(rc.baseVersion) ?? []
      list.push(rc)
      releaseCandidatesByBaseVersion.set(rc.baseVersion, list)
    }
  }

  const allBaseVersions = new Set<string>([
    ...releases.map((x) => x.baseVersion).filter((x): x is string => Boolean(x)),
    ...releaseCandidates.map((x) => x.baseVersion).filter((x): x is string => Boolean(x))
  ])

  const ordererdBaseVersions = [...allBaseVersions].sort(compareBaseVersionsDesc)

  for (const baseVersion of ordererdBaseVersions) {
    const release = releasesByBaseVersion.get(baseVersion)
    if (release) {
      result.push(release)
    }

    const rcs = releaseCandidatesByBaseVersion.get(baseVersion) ?? []
    result.push(...rcs)
  }

  return result
}

function branchExists(repoDir: string, branch: string): boolean {
  const refs = [`refs/heads/${branch}`, `refs/remotes/origin/${branch}`]

  return refs.some((ref) => {
    const result = spawnSync('git', ['show-ref', '--verify', '--quiet', ref], {
      cwd: repoDir,
      stdio: 'ignore',
    })
    return result.status === 0
  })
}

function compareReleaseCandidatesDesc(a: ParsedReleaseCandidateTag, b: ParsedReleaseCandidateTag): number {
  const baseCmp = compareBaseVersionsDesc(a.baseVersion, b.baseVersion)
  if (baseCmp !== 0) return baseCmp
  return b.releaseCandidateNumber - a.releaseCandidateNumber
}

function compareBaseVersionsDesc(a: string, b: string): number {
  return -compareBaseVersionsAsc(a, b)
}

function compareBaseVersionsAsc(a: string, b: string): number {
  const pa = tokenizeVersion(a)
  const pb = tokenizeVersion(b)
  const len = Math.max(pa.length, pb.length)

  for (let i = 0; i < len; i++) {
    const av = pa[i]
    const bv = pb[i]

    if (av === undefined && bv === undefined) return 0
    if (av === undefined) return -1
    if (bv === undefined) return 1

    const aNum = typeof av === 'number'
    const bNum = typeof bv === 'number'

    if (aNum && bNum) {
      if (av < bv) return -1
      if (av > bv) return 1
      continue
    }

    const as = String(av)
    const bs = String(bv)

    if (as < bs) return -1
    if (as > bs) return 1
  }

  return 0
}

function tokenizeVersion(version: string): Array<number | string> {
  return version
    .replace(/^v/i, '')
    .split(/[\.-]/g)
    .filter(Boolean)
    .map((part) => (/^\d+$/.test(part) ? Number(part) : part.toLowerCase()))
}

interface ParsedStableTag {
  tag: string
  baseVersion: string
}

interface ParsedReleaseCandidateTag {
  tag: string
  baseVersion: string
  releaseCandidateNumber: number
}

function parseStableTag(tag: string, prefix: string): ParsedStableTag | null {
  const raw = tag.slice(prefix.length).trim()
  if (!raw) return null

  const baseVersion = normalizeBaseVersion(raw)
  if (!isValidBaseVersion(baseVersion)) return null

  return { tag, baseVersion }
}

function parseReleaseCandidateTag(tag: string, prefix: string): ParsedReleaseCandidateTag | null {
  const raw = tag.slice(prefix.length).trim()
  // expected: v2.0/rc1
  const match = /^(.+)\/rc(\d+)$/i.exec(raw)
  if (!match) return null

  const [, rawBaseVersion, rawRcNumber] = match
  const baseVersion = normalizeBaseVersion(rawBaseVersion)
  const releaseCandidateNumber = Number(rawRcNumber)

  if (!isValidBaseVersion(baseVersion) || !Number.isInteger(releaseCandidateNumber) || releaseCandidateNumber < 1) {
    return null
  }

  return {
    tag,
    baseVersion,
    releaseCandidateNumber,
  }
}

function normalizeBaseVersion(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  return /^v/i.test(trimmed) ? `v${trimmed.slice(1)}` : `v${trimmed}`
}

function isValidBaseVersion(value: string): boolean {
  return /^v[0-9]+(?:\.[0-9]+)*(?:[-._a-z0-9]+)?$/i.test(value)
}

function listTags(repositoryPath: string): string[] {
  const output = git(repositoryPath, 'tag', '--list')

  return output
    .split(/\r?\n/g)
    .map(x => x.trim())
    .filter(Boolean)
}

function git(repositoryPath: string, ...args: string[]): string {
  try {
    return execFileSync('git', args, {
      cwd: repositoryPath,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  }
  catch {
    return ''
  }
}
