/**
 * Assembles the final deploy tree:
 *
 *   deploy/                              ← website at root
 *   deploy/docs/index.html               ← versionless redirector → latest
 *   deploy/docs/<version>/...            ← docs build
 *   deploy/docs/versions.json            ← merged docs manifest
 *   deploy/spec/index.html               ← versionless redirector → latest
 *   deploy/spec/<version>/...            ← spec build
 *   deploy/spec/versions.json            ← merged spec manifest
 *   deploy/spec/<version>/spec.pdf       ← inside spec build
 *
 * Each Nuxt app builds with its `app.baseURL` set to the deployed prefix
 * (e.g. `/docs/v0.0.1/`), which is what gets baked into <link>, <script>,
 * and route hrefs. The generated *files* still sit at the root of
 * `.output/public`, so we copy them under the matching prefix here.
 *
 * The per-app `versions.json` is hoisted out of the versioned build dir
 * to the channel root so it's reachable at a stable URL. We also write a
 * tiny redirector at `/<app>/index.html` that picks the latest stable (or
 * preview, or `next`) at runtime — so header links to bare `/docs/` work.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import type { VersionsManifest } from '../packages/nuxt/layer/utils/versioning';

const root = resolve('.');
const deploy = resolve(root, 'deploy');

rmSync(deploy, { recursive: true, force: true });
mkdirSync(deploy, { recursive: true });

const websiteOut = resolve(root, 'packages/nuxt/website/.output/public');
const docsOut = resolve(root, 'packages/nuxt/docs/.output/public');
const specOut = resolve(root, 'packages/nuxt/spec/.output/public');

for (const p of [websiteOut, docsOut, specOut]) {
  if (!existsSync(p)) die(`missing ${p}`);
}

const version = detectVersion();

cpSync(websiteOut, deploy, { recursive: true });
copyApp('docs', docsOut, version);
copyApp('spec', specOut, version);

writeRedirector('docs');
writeRedirector('spec');

// GitHub Pages defaults to running Jekyll, which drops anything whose
// path starts with `_` — Nuxt emits everything under `_nuxt/`, so without
// this marker the site loads as a sea of broken links.
writeFileSync(join(deploy, '.nojekyll'), '');

// Custom domain. GitHub Pages writes this from the repo settings on every
// deploy, but baking it into the artifact means the deploy is self-
// describing and survives manual restores.
writeFileSync(join(deploy, 'CNAME'), '2b.team\n');

console.log(`deploy ready at ${deploy} (version=${version})`);

function copyApp(app: 'docs' | 'spec', fromDir: string, segment: string) {
  const targetDir = join(deploy, app, segment);
  mkdirSync(targetDir, { recursive: true });
  cpSync(fromDir, targetDir, { recursive: true });

  const inner = join(targetDir, 'versions.json');
  const outer = join(deploy, app, 'versions.json');
  if (existsSync(inner)) renameSync(inner, outer);
}

function writeRedirector(app: 'docs' | 'spec') {
  const manifestPath = join(deploy, app, 'versions.json');
  let target = `/${app}/${version}/`;
  if (existsSync(manifestPath)) {
    const m = JSON.parse(readFileSync(manifestPath, 'utf8')) as VersionsManifest;
    const latest =
      m.channels?.stable?.latest ??
      m.channels?.preview?.latest ??
      m.channels?.next?.latest ??
      version;
    target = `/${app}/${latest}/`;
  }
  const html = `<!doctype html>
<meta charset="utf-8">
<title>Redirecting…</title>
<meta http-equiv="refresh" content="0; url=${target}">
<link rel="canonical" href="${target}">
<script>
  fetch('/${app}/versions.json', { cache: 'no-store' }).then(function (r) {
    return r.ok ? r.json() : null;
  }).then(function (m) {
    if (!m) return;
    var latest =
      (m.channels && m.channels.stable && m.channels.stable.latest) ||
      (m.channels && m.channels.preview && m.channels.preview.latest) ||
      (m.channels && m.channels.next && m.channels.next.latest);
    if (latest) location.replace('/${app}/' + latest + '/');
  }).catch(function () {});
</script>
<p>Redirecting to <a href="${target}">${target}</a>…</p>
`;
  writeFileSync(join(deploy, app, 'index.html'), html);
}

function detectVersion(): string {
  if (process.env.VERSION_NAME) return process.env.VERSION_NAME;
  const ref = process.env.GITHUB_REF_NAME ?? safe('git rev-parse --abbrev-ref HEAD');
  if (ref && /^v\d+\.\d+\.\d+(?:-pre\d+)?$/.test(ref)) return ref;
  return 'next';
}

function safe(cmd: string): string | null {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}

function die(msg: string): never {
  console.error(msg);
  process.exit(1);
}
