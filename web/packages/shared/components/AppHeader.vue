<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  homePath?: string
}>(), {
  title: '2b',
  homePath: '/',
})
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <a :href="props.homePath" class="app-header__brand">
        {{ props.title }}
      </a>
      <nav class="app-header__nav">
        <slot name="nav" />
      </nav>
      <div class="app-header__actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  @apply sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200;
}

.app-header__inner {
  @apply max-w-7xl mx-auto px-6 h-14 flex items-center gap-6;
}

.app-header__brand {
  @apply text-lg font-bold tracking-tight text-primary-700;
}

.app-header__nav {
  @apply flex items-center gap-4 flex-1;
}

.app-header__nav :deep(a) {
  @apply text-sm text-gray-600 hover:text-primary-600 transition-colors;
}

.app-header__nav :deep(a.router-link-active) {
  @apply text-primary-700 font-medium;
}

.app-header__actions {
  @apply flex items-center gap-3;
}
</style>
