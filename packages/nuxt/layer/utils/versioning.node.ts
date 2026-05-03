// Build-time only. Pulls in `node:child_process` to shell out to git.
// Importing from this module from runtime code (composables, components)
// will leak `execSync` into the browser bundle — use `./versioning` instead.
import { execSync } from 'node:child_process'
import { classify, type VersionInfo } from './versioning'

function git(args: string): string | null
{
  try
  {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  }
  catch
  {
    return null
  }
}

/**
 * Detect the current build's version from environment + git.
 *
 * Priority:
 * 1. `VERSION_NAME` env var (explicit override)
 * 2. `GITHUB_REF_NAME` env var (set in GitHub Actions)
 * 3. Local `git describe --tags` / `git rev-parse --abbrev-ref HEAD`
 *
 * Tags shaped `vX.Y.Z` are stable, `vX.Y.Z-preN` are preview, anything else
 * is the rolling `next` channel.
 */
export function detectVersion(env: NodeJS.ProcessEnv = process.env): VersionInfo
{
  const explicit = env.VERSION_NAME?.trim()
  const ghRef = env.GITHUB_REF_NAME?.trim()
  const localTag = git('describe --tags --exact-match HEAD')
  const localBranch = git('rev-parse --abbrev-ref HEAD')

  const ref = explicit ?? ghRef ?? localTag ?? localBranch ?? 'next'
  const channel = classify(ref)
  const name = channel === 'next' ? 'next' : ref
  const segment = name
  const sha = (env.GITHUB_SHA ?? git('rev-parse --short HEAD') ?? '').slice(0, 7)
  const builtAt = new Date().toISOString()

  return { channel, name, segment, ref, sha, builtAt }
}
