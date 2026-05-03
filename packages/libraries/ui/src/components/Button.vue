<script setup lang="ts">
defineProps<{ variant?: 'primary' | 'secondary' }>()
</script>

<template>
  <button
    :class="[
      'inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors',
      variant === 'primary'
        ? 'bg-brand-500 text-white hover:bg-brand-900'
        : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ]"
  >
    <slot />
  </button>
</template>
