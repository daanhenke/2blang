import { computed } from 'vue'
import { useRuntimeConfig, useAppConfig } from '#imports'
import type { VersionInfo } from '../utils/versioning'

interface SiteRuntime {
  version: VersionInfo
  pdfMode?: boolean
}

interface AppFeatures {
  versioning?: boolean
  search?: boolean
}

/**
 * The site's runtime identity. `version` and `pdfMode` come from the build's
 * runtime config; `features` come from `app.config.ts` so apps can toggle
 * functionality without the layer knowing their slugs.
 *
 * `appSlug` is derived from `app.baseURL` (the first non-empty segment) — so
 * `/docs/v0.0.1/` → `'docs'`, `/` → `null`. Components that need to compose
 * URLs (version switcher, manifest fetch) use this.
 */
export function useSiteContext()
{
  const runtime = useRuntimeConfig()
  const appConfig = useAppConfig()
  const data = (runtime.public['2blang'] ?? {}) as SiteRuntime
  const features = (appConfig.features ?? {}) as AppFeatures
  const baseURL = runtime.app.baseURL

  return {
    version: computed(() => data.version),
    pdfMode: computed(() => Boolean(data.pdfMode)),
    features: computed(() => features),
    appSlug: computed(() =>
    {
      const first = baseURL.split('/').filter(Boolean)[0]
      return first ?? null
    }),
    baseURL
  }
}
