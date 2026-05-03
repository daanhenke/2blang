/**
 * Fetches the live versions.json from production and merges the freshly
 * built one into it, in place. Run as `tsx scripts/merge-manifest.ts <app>`
 * where <app> is "docs" or "spec".
 *
 * If the live file 404s (first deploy), the local manifest is left as-is.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { VersionsManifest, ChannelEntry } from '../packages/nuxt/layer/utils/versioning';

const app = process.argv[2];
if (app !== 'docs' && app !== 'spec') {
  console.error('usage: merge-manifest.ts <docs|spec>');
  process.exit(2);
}

const localPath = resolve(`packages/nuxt/${app}/.output/public/versions.json`);
if (!existsSync(localPath)) {
  console.error(`no local manifest at ${localPath}; did the build run?`);
  process.exit(1);
}

const local = JSON.parse(readFileSync(localPath, 'utf8')) as VersionsManifest;
const remoteUrl = `https://2b.team/${app}/versions.json`;

let remote: VersionsManifest | null = null;
try {
  const res = await fetch(remoteUrl, { redirect: 'follow' });
  if (res.ok) remote = (await res.json()) as VersionsManifest;
  else console.warn(`remote ${remoteUrl} returned ${res.status}, using local only`);
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.warn(`remote ${remoteUrl} unreachable (${msg}), using local only`);
}

if (!remote) {
  console.log(`wrote ${localPath} (no merge)`);
  process.exit(0);
}

const merged: VersionsManifest = {
  channels: {
    stable: mergeChannel(remote.channels?.stable, local.channels?.stable),
    preview: mergeChannel(remote.channels?.preview, local.channels?.preview),
    next: mergeChannel(remote.channels?.next, local.channels?.next, true),
  },
  versions: { ...(remote.versions ?? {}), ...(local.versions ?? {}) },
};

writeFileSync(localPath, JSON.stringify(merged, null, 2));
console.log(`merged remote into ${localPath}`);

function mergeChannel(
  a: ChannelEntry | undefined,
  b: ChannelEntry | undefined,
  rolling = false,
): ChannelEntry {
  const A = a ?? { latest: null, versions: [] };
  const B = b ?? { latest: null, versions: [] };
  if (rolling) {
    return { latest: B.latest ?? A.latest ?? null, versions: ['next'] };
  }
  const versions = [...new Set([...(A.versions ?? []), ...(B.versions ?? [])])].sort(
    (x, y) => y.localeCompare(x, undefined, { numeric: true }),
  );
  return { latest: versions[0] ?? null, versions };
}
