<script setup lang="ts">
const { public: { currentVersion, sitePrefix } } = useRuntimeConfig()
</script>

<template>
  <div class="docs-layout">
    <AppHeader title="2b Docs" :home-path="`${sitePrefix}/`">
      <template #nav>
        <a :href="`${sitePrefix}/`">Home</a>
        <NuxtLink to="/">Docs</NuxtLink>
        <a :href="`${sitePrefix}/spec/${currentVersion}/`">Spec</a>
      </template>
      <template #actions>
        <VersionSwitcher />
      </template>
    </AppHeader>

    <div class="docs-layout__body">
      <aside class="docs-layout__sidebar">
        <DocsSidebar />
      </aside>
      <main class="docs-layout__content">
        <slot />
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
.docs-layout__body {
  @apply max-w-7xl mx-auto flex min-h-[calc(100vh-7rem)];
}

.docs-layout__sidebar {
  @apply w-64 shrink-0 border-r border-gray-200 p-6 hidden lg:block;
  @apply sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto;
}

.docs-layout__content {
  @apply flex-1 px-8 py-8 max-w-none prose prose-slate;
}
</style>
