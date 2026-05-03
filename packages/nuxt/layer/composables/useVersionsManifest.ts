import { ref, type Ref } from 'vue'
import { useFetch } from '#imports'
import { useSiteContext } from './useSiteContext'
import { defaultManifest, type VersionsManifest } from '../utils/versioning'

/**
 * Fetches the live `versions.json` for the current app (e.g. `/docs/versions.json`)
 * when `features.versioning` is enabled. Returns a manifest seeded with the
 * current build so the version switcher always has *something* to show, even
 * before the fetch completes (or if it fails).
 *
 * Must be called from a setup-time context. `useFetch` cannot be invoked
 * from inside `watchEffect` — its reactive refs would feed back into the
 * effect's dependency tracking and spin forever.
 */
export function useVersionsManifest(): Ref<VersionsManifest>
{
  const { features, version, appSlug } = useSiteContext()

  if (!features.value.versioning || !appSlug.value)
  {
    return ref(defaultManifest())
  }

  const seeded = (): VersionsManifest =>
  {
    const m = defaultManifest()
    m.versions[version.value.name] = version.value
    m.channels[version.value.channel].versions = [version.value.name]
    m.channels[version.value.channel].latest = version.value.name
    return m
  }

  const { data } = useFetch<VersionsManifest>(`/${appSlug.value}/versions.json`, {
    key: `versions-${appSlug.value}`,
    default: seeded,
    server: false
  }) as { data: Ref<VersionsManifest> }

  return data
}
