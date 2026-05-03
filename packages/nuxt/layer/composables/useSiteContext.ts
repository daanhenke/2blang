import { computed } from 'vue'
import { useRuntimeConfig, useAppConfig } from '#imports'
import type { VersionInfo } from '../utils/versioning'

interface SiteRuntime {
  version: VersionInfo
  pdfMode?: boolean
  /** Optional URL prefix (e.g. `/2blang`). Empty when not set. */
  basePrefix?: string
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
 * `appSlug` is derived from `app.baseURL`. `basePrefix` (if set, e.g.
 * `/2blang` for staged GitHub Pages) is stripped before picking the slug.
 * `prefix(path)` prepends `basePrefix` so cross-app links work in both
 * normal and prefixed deploys.
 */
export function useSiteContext()
{
  const runtime = useRuntimeConfig()
  const appConfig = useAppConfig()
  const data = (runtime.public['2blang'] ?? {}) as SiteRuntime
  const features = (appConfig.features ?? {}) as AppFeatures
  const baseURL = runtime.app.baseURL
  const basePrefix = (data.basePrefix ?? '').replace(/\/$/, '')

  return {
    version: computed(() => data.version),
    pdfMode: computed(() => Boolean(data.pdfMode)),
    features: computed(() => features),
    appSlug: computed(() =>
    {
      const segs = baseURL.split('/').filter(Boolean)
      const prefixSeg = basePrefix.replace(/^\//, '')
      if (prefixSeg && segs[0] === prefixSeg) return segs[1] ?? null
      return segs[0] ?? null
    }),
    basePrefix,
    /** Prepend the optional base prefix to an absolute path. */
    prefix: (path: string) => `${basePrefix}${path.startsWith('/') ? path : `/${path}`}`,
    baseURL
  }
}
