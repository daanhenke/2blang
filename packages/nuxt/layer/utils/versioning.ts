// Browser-safe runtime helpers and types only. The Node-only
// `detectVersion` (which shells out to git via `node:child_process`) lives
// in `./versioning.node.ts` to keep `node:child_process` out of the client
// bundle — Vite externalises it and the build choked when composables
// reached for `defaultManifest` from the same file.

export type VersionChannel = 'stable' | 'preview' | 'next'

export interface VersionInfo {
  /** Channel this build belongs to. */
  channel: VersionChannel
  /** Display name (e.g. `v0.0.1`, `v0.0.1-pre23`, `next`). */
  name: string
  /** URL path segment under `/docs/` or `/spec/`. */
  segment: string
  /** Git ref the build came from (tag or branch name). */
  ref: string
  /** Short commit sha. */
  sha: string
  /** ISO timestamp the build was produced. */
  builtAt: string
}

export interface ChannelEntry {
  latest: string | null
  versions: string[]
}

export interface VersionsManifest {
  channels: {
    stable: ChannelEntry
    preview: ChannelEntry
    next: ChannelEntry
  }
  /** Full per-version metadata, keyed by version name. */
  versions: Record<string, VersionInfo>
}

export const STABLE_RE = /^v\d+\.\d+\.\d+$/
export const PREVIEW_RE = /^v\d+\.\d+\.\d+-pre\d+$/

export function classify(ref: string): VersionChannel
{
  if (STABLE_RE.test(ref)) return 'stable'
  if (PREVIEW_RE.test(ref)) return 'preview'
  return 'next'
}

export function defaultManifest(): VersionsManifest
{
  return {
    channels: {
      stable: { latest: null, versions: [] },
      preview: { latest: null, versions: [] },
      next: { latest: null, versions: [] }
    },
    versions: {}
  }
}

function sortVersions(versions: string[]): string[]
{
  return [...versions].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
}

/**
 * Merge a freshly built version into an existing manifest. The `next` channel
 * keeps a single rolling entry; stable + preview accumulate.
 */
export function mergeManifest(
  existing: VersionsManifest | null,
  incoming: VersionInfo
): VersionsManifest
{
  const m: VersionsManifest = existing ? structuredClone(existing) : defaultManifest()
  const channel = m.channels[incoming.channel]

  if (incoming.channel === 'next')
  {
    channel.versions = ['next']
    channel.latest = 'next'
  }
  else if (!channel.versions.includes(incoming.name))
  {
    channel.versions = sortVersions([...channel.versions, incoming.name])
    channel.latest = channel.versions[0] ?? incoming.name
  }
  else if (!channel.latest)
  {
    channel.latest = sortVersions(channel.versions)[0] ?? null
  }

  m.versions[incoming.name] = incoming
  return m
}
