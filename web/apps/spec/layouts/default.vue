<template>
  <div class="spec-layout">
    <AppHeader title="2b Spec" home-path="/">
      <template #nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/docs/next/">Docs</NuxtLink>
        <NuxtLink to="/spec/next/">Spec</NuxtLink>
      </template>
      <template #actions>
        <VersionSwitcher base-path="/spec" />
      </template>
    </AppHeader>

    <div class="spec-layout__body">
      <aside class="spec-layout__sidebar">
        <SpecToc />
      </aside>
      <main class="spec-layout__content">
        <slot />
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
.spec-layout__body {
  @apply max-w-7xl mx-auto flex min-h-[calc(100vh-7rem)];
}

.spec-layout__sidebar {
  @apply w-64 shrink-0 border-r border-gray-200 p-6 hidden lg:block;
  @apply sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto;
}

.spec-layout__content {
  @apply flex-1 px-8 py-8 max-w-none prose prose-slate;
}
</style>
