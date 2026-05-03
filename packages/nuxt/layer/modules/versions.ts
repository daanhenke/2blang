import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { defineNuxtModule } from '@nuxt/kit'
import { defaultManifest, mergeManifest } from '../utils/versioning'
import { detectVersion } from '../utils/versioning.node'

interface NitroConfigSlice {
  publicAssets?: Array<{ dir: string, baseURL?: string }>
}
type NitroHook = (key: 'nitro:config', fn: (config: NitroConfigSlice) => void) => void

/**
 * Always exposes the detected version through `runtimeConfig.public['2blang']`.
 * Emits a fresh `versions.json` to the static output only when the consuming
 * app has `appConfig.features.versioning === true`. The CI deploy step is
 * responsible for merging this with the live manifest.
 *
 * Implementation note: rather than hooking the build, we stage the manifest
 * into a temp directory and register that directory as a Nitro `publicAssets`
 * source. Nitro copies it into `.output/public/versions.json` during
 * generation. This avoids depending on hook names that move between Nuxt
 * versions.
 */
const versionsModule = defineNuxtModule<Record<string, never>>({
  meta: { name: '2blang-versions' },
  setup(_options, nuxt)
  {
    const version = detectVersion()

    nuxt.options.runtimeConfig.public ??= {}
    const pub = nuxt.options.runtimeConfig.public as Record<string, unknown>
    pub['2blang'] = {
      ...((pub['2blang'] as Record<string, unknown>) ?? {}),
      version
    }

    const features = (nuxt.options.appConfig?.features ?? {}) as {
      versioning?: boolean
    }
    if (!features.versioning) return

    const manifest = mergeManifest(defaultManifest(), version)
    const stageDir = mkdtempSync(join(tmpdir(), '2blang-versions-'))
    mkdirSync(stageDir, { recursive: true })
    writeFileSync(
      join(stageDir, 'versions.json'),
      JSON.stringify(manifest, null, 2)
    );

    // The `nitro:config` hook lives on Nitro's hook map, which augments
    // NuxtHooks at runtime but isn't always picked up by TS — cast the
    // hook function to a typed slice so the build doesn't complain.
    (nuxt.hook as NitroHook)('nitro:config', (config) =>
    {
      config.publicAssets ??= []
      config.publicAssets.push({ dir: stageDir, baseURL: '/' })
    })
  }
})

export default versionsModule
