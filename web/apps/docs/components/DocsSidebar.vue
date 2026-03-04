<script setup lang="ts">
const { data: navigation } = await useAsyncData('docs-nav', async () => {
  const nav = await queryCollectionNavigation('docs')
  return nav ?? []
})
</script>

<template>
  <nav class="docs-sidebar">
    <template v-if="navigation">
      <DocsSidebarTree :items="navigation" />
    </template>
  </nav>
</template>

<style scoped>
.docs-sidebar {
  @apply text-sm;
}
</style>
