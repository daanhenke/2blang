<script setup lang="ts">
const model = defineModel<string>({ default: '' })
defineProps<{ placeholder?: string, type?: string }>()
</script>

<template>
  <input
    v-model="model"
    :type="type ?? 'text'"
    :placeholder="placeholder"
    class="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
  />
</template>
