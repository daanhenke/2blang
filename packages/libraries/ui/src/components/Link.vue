<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  to?: string
  href?: string
  external?: boolean
}>()

const target = computed(() => props.to ?? props.href ?? '#')
const isExternal = computed(() =>
{
  if (props.external) return true
  return /^(https?:)?\/\//.test(target.value)
})
</script>

<template>
  <a
    v-if="isExternal"
    :href="target"
    target="_blank"
    rel="noopener noreferrer"
    class="text-brand-500 hover:text-brand-900 underline-offset-2 hover:underline"
  >
    <slot />
  </a>
  <NuxtLink
    v-else
    :to="target"
    class="text-brand-500 hover:text-brand-900 underline-offset-2 hover:underline"
  >
    <slot />
  </NuxtLink>
</template>
