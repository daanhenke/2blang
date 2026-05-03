<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useSiteContext } from '../composables/useSiteContext'

interface DevSites {
  website?: string
  docs?: string
  spec?: string
}

const app = useAppConfig()
const { pdfMode, prefix } = useSiteContext()

// In dev each app runs on its own port; in prod they share an origin.
// `prefix()` adds the optional base prefix (e.g. `/2blang` for the staged
// GitHub Pages deploy) — empty string in dev and on the real domain.
const links = computed(() =>
{
  if (import.meta.dev)
  {
    const sites = (app.devSites ?? {}) as DevSites
    return {
      home: sites.website ?? '/',
      docs: sites.docs ?? '/docs/',
      spec: sites.spec ?? '/spec/'
    }
  }
  return {
    home: prefix('/'),
    docs: prefix('/docs/'),
    spec: prefix('/spec/')
  }
})
</script>

<template>
  <header
    v-if="!pdfMode"
    class="border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-30"
  >
    <div class="flex items-center gap-6">
      <a
        :href="links.home"
        class="text-lg font-semibold"
      >{{ app.brand.name }}</a>
      <nav class="hidden md:flex gap-4 text-sm">
        <a :href="links.home">Home</a>
        <a :href="links.docs">Docs</a>
        <a :href="links.spec">Spec</a>
      </nav>
    </div>
    <div class="flex items-center gap-3">
      <SearchOverlay />
      <VersionSwitcher />
    </div>
  </header>
</template>
