<script setup lang="ts">
const { public: { currentVersion, sitePrefix } } = useRuntimeConfig()
</script>

<template>
  <div class="layout">
    <AppHeader title="2b" :home-path="`${sitePrefix}/`">
      <template #nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/downloads">Downloads</NuxtLink>
        <NuxtLink to="/explore">Explore</NuxtLink>
        <a :href="`${sitePrefix}/docs/${currentVersion}/`">Docs</a>
        <a :href="`${sitePrefix}/spec/${currentVersion}/`">Spec</a>
      </template>
      <template #actions>
        <a
          href="https://github.com/your-org/2blang"
          target="_blank"
          rel="noopener"
          class="text-sm text-gray-500 hover:text-primary-600"
        >
          GitHub
        </a>
      </template>
    </AppHeader>

    <main class="layout__main">
      <slot />
    </main>

    <AppFooter>
      <a href="https://github.com/your-org/2blang" target="_blank" rel="noopener">GitHub</a>
    </AppFooter>
  </div>
</template>

<style scoped>
.layout__main {
  @apply min-h-[calc(100vh-7rem)];
}
</style>
