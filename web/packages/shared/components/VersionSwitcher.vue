<script setup lang="ts">
import type { VersionManifest, VersionEntry } from '../composables/useVersioning'

const { manifest, currentVersion } = useVersioning()
const config = useRuntimeConfig()

// baseURL is e.g. "/2blang/docs/next/" or "/docs/next/"
// Strip the current version segment and rebuild with the target version
const basePath = ((config.app as any).baseURL as string || '/')
  .replace(/\/$/, '')       // remove trailing slash
  .replace(/\/[^/]+$/, '')  // remove version segment → "/2blang/docs" or "/docs"

function versionUrl(version: VersionEntry): string {
  return `${basePath}/${version.id}/`
}

function navigateToVersion(event: Event) {
  const select = event.target as HTMLSelectElement
  const version = manifest.value?.versions.find(v => v.id === select.value)
  if (version) {
    // Full page navigation — versions are separate Nuxt apps
    window.location.href = versionUrl(version)
  }
}
</script>

<template>
  <div class="version-switcher">
    <select
      class="version-switcher__select"
      :value="currentVersion"
      @change="navigateToVersion"
    >
      <option
        v-for="version in manifest?.versions"
        :key="version.id"
        :value="version.id"
      >
        {{ version.label }}{{ version.type === 'release-candidate' ? ' (RC)' : '' }}
      </option>
    </select>
    <span
      v-if="manifest?.current?.type === 'next'"
      class="version-switcher__dev-badge"
    >
      DEV
    </span>
  </div>
</template>

<style scoped>
.version-switcher {
  @apply relative inline-flex items-center gap-2;
}

.version-switcher__select {
  @apply appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm;
  @apply cursor-pointer hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
}

.version-switcher__dev-badge {
  @apply inline-block px-1.5 py-0.5 text-xs font-bold rounded bg-red-500 text-white uppercase tracking-wider;
}
</style>
