<script setup lang="ts">
const model = defineModel<string>({ default: '' })
defineProps<{ language?: string }>()
</script>

<template>
  <textarea
    v-model="model"
    class="w-full h-full font-mono text-sm p-3 border border-gray-200 rounded-md"
    spellcheck="false"
    autocorrect="off"
    autocapitalize="off"
  />
</template>
