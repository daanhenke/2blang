<script setup lang="ts">
import { usePdfMode } from '../composables/usePdfMode'

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

defineProps<{ links: TocLink[] }>()
const pdf = usePdfMode()
</script>

<template>
  <nav
    v-if="!pdf"
    class="hidden xl:block w-56 shrink-0 px-4 py-6 sticky top-14 self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto text-sm"
  >
    <p class="text-xs uppercase tracking-wide text-gray-500 mb-2">
      On this page
    </p>
    <ul class="space-y-1">
      <li
        v-for="link in links"
        :key="link.id"
        :style="{ paddingLeft: `${(link.depth - 1) * 0.75}rem` }"
      >
        <a
          :href="`#${link.id}`"
          class="text-gray-600 hover:text-brand-500"
        >{{ link.text }}</a>
      </li>
    </ul>
  </nav>
</template>
