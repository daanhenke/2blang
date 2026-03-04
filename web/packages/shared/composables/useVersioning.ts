export interface VersionEntry {
  id: string
  type: 'release' | 'release-candidate' | 'next'
  label: string
  gitRef: string
  path: string
}

export interface VersionManifest {
  latest: string
  current: { id: string, type: VersionEntry['type'] }
  versions: VersionEntry[]
}

const manifestState = ref<VersionManifest | null>(null)
const manifestLoaded = ref(false)

export function useVersioning() {
  const config = useRuntimeConfig()
  const currentVersion = computed(() => config.public.currentVersion as string)
  const currentVersionType = computed(() => config.public.currentVersionType as string)

  async function loadManifest() {
    if (manifestLoaded.value)
      return
    try {
      const data = await $fetch<VersionManifest>('/version-manifest.json')
      manifestState.value = data
    }
    catch {
      // In dev mode, create a synthetic manifest with just "next"
      manifestState.value = {
        latest: 'next',
        current: { id: 'next', type: 'next' },
        versions: [
          {
            id: 'next',
            type: 'next',
            label: 'next (dev)',
            gitRef: 'master',
            path: '/docs/next/',
          },
        ],
      }
    }
    finally {
      manifestLoaded.value = true
    }
  }

  // Load manifest on first use — only client-side to avoid SSR prerender fetch loops
  if (typeof window !== 'undefined' && !manifestLoaded.value) {
    loadManifest()
  }

  return {
    manifest: manifestState as Readonly<Ref<VersionManifest | null>>,
    currentVersion,
    currentVersionType,
    loadManifest,
  }
}
