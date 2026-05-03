<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSiteContext } from '../composables/useSiteContext'
import { useVersionsManifest } from '../composables/useVersionsManifest'

const { version, features, appSlug } = useSiteContext()
const manifest = useVersionsManifest()
const open = ref(false)

interface Group {
  channel: 'stable' | 'preview' | 'next'
  label: string
  versions: string[]
}

const groups = computed<Group[]>(() =>
{
  const m = manifest.value
  const all: Group[] = [
    { channel: 'stable', label: 'Stable', versions: m.channels.stable.versions },
    { channel: 'preview', label: 'Preview', versions: m.channels.preview.versions },
    { channel: 'next', label: 'Next', versions: m.channels.next.versions }
  ]
  return all.filter((g) => g.versions.length > 0)
})

function urlFor(versionName: string)
{
  return `/${appSlug.value ?? ''}/${versionName}/`
}
</script>

<template>
  <div
    v-if="features.versioning"
    class="relative"
  >
    <button
      type="button"
      class="inline-flex items-center gap-1 px-2 py-1 rounded text-sm border border-gray-300 hover:bg-gray-50"
      @click="open = !open"
    >
      <span>{{ version.name }}</span>
      <span class="i-lucide-chevron-down w-4 h-4" />
    </button>
    <div
      v-if="open"
      class="absolute right-0 mt-1 w-56 bg-white rounded-md border border-gray-200 shadow-lg z-40"
      @click="open = false"
    >
      <div
        v-for="group in groups"
        :key="group.channel"
        class="py-1"
      >
        <div class="px-3 py-1 text-xs uppercase tracking-wide text-gray-500">
          {{ group.label }}
        </div>
        <a
          v-for="v in group.versions"
          :key="v"
          :href="urlFor(v)"
          :class="[
            'block px-3 py-1 text-sm',
            v === version.name ? 'bg-brand-50 text-brand-900' : 'hover:bg-gray-50',
          ]"
        >
          {{ v }}
        </a>
      </div>
    </div>
  </div>
</template>
