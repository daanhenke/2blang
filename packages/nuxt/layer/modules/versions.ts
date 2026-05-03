import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'
import { defaultManifest, mergeManifest } from '../utils/versioning'
import { detectVersion } from '../utils/versioning.node'

interface NitroLike {
  hooks: { hookOnce: (k: string, fn: () => void | Promise<void>) => void }
  options: { output: { publicDir: string } }
}
type NitroInitHook = (key: 'nitro:init', fn: (nitro: NitroLike) => void) => void

export interface VersionsModuleOptions {
  /**
   * Whether to emit a `versions.json` manifest into the static output.
   * Build-time flag; this is independent of the runtime
   * `appConfig.features.versioning` flag (which controls UI rendering of
   * the version switcher). They normally mirror each other.
   *
   * `nuxt.options.appConfig` isn't merged with each layer's `app.config.ts`
   * at module setup time, so we can't read `features.versioning` here —
   * each app's `nuxt.config.ts` sets this option explicitly instead.
   */
  emitManifest?: boolean
}

const versionsModule = defineNuxtModule<VersionsModuleOptions>({
  meta: { name: 'versioning', configKey: 'versioning' },
  defaults: { emitManifest: false },
  setup(options, nuxt)
  {
    const version = detectVersion()

    const pub = nuxt.options.runtimeConfig.public as unknown as Record<string, unknown>
    pub['2blang'] = {
      ...((pub['2blang'] as Record<string, unknown>) ?? {}),
      version
    }

    if (!options.emitManifest) return

    const manifest = mergeManifest(defaultManifest(), version);

    // Write directly into Nitro's output dir once it's compiled. Tried
    // publicAssets first but the staging dir under `.nuxt/` gets cleaned
    // before Nitro reads it, so the file never lands in `.output/public`.
    (nuxt.hook as NitroInitHook)('nitro:init', (nitro) =>
    {
      nitro.hooks.hookOnce('compiled', () =>
      {
        const out = join(nitro.options.output.publicDir, 'versions.json')
        mkdirSync(dirname(out), { recursive: true })
        writeFileSync(out, JSON.stringify(manifest, null, 2))
      })
    })
  }
})

export default versionsModule
