<script setup lang="ts">
import { useAppConfig } from '#imports'
import { usePdfMode } from '../composables/usePdfMode'

const app = useAppConfig()
const pdf = usePdfMode()
</script>

<template>
  <footer
    v-if="!pdf"
    class="border-t border-gray-200 px-6 py-4 text-sm text-gray-600 flex justify-between"
  >
    <span>&copy; {{ new Date().getFullYear() }} {{ app.brand.name }}</span>
    <span><UiLink href="https://github.com/2b-team">GitHub</UiLink></span>
  </footer>
</template>
