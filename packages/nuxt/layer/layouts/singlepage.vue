<script setup lang="ts">
import { usePdfMode } from '../composables/usePdfMode'

const pdf = usePdfMode()
defineProps<{ tocLinks?: { id: string, text: string, depth: number }[] }>()
</script>

<template>
  <div
    :class="[
      'min-h-screen flex flex-col font-sans bg-white text-gray-900',
      pdf && 'pdf-page',
    ]"
  >
    <SiteHeader />
    <div class="flex-1 flex w-full max-w-screen-2xl mx-auto">
      <main
        :class="[
          'flex-1 min-w-0 px-6 py-8',
          pdf ? 'pdf-content' : 'max-w-4xl mx-auto',
        ]"
      >
        <slot />
      </main>
      <Toc
        v-if="tocLinks"
        :links="tocLinks"
      />
    </div>
    <SiteFooter />
  </div>
</template>

<style>
[data-pdf-mode='true'] {
  font-size: 11pt;
}
[data-pdf-mode='true'] .pdf-page {
  background: white;
}
[data-pdf-mode='true'] .pdf-content {
  max-width: none;
}
@page {
  size: A4;
  margin: 18mm 16mm;
}
</style>
