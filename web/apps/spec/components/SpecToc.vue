<script setup lang="ts">
const { data: navigation } = await useAsyncData('spec-nav', async () => {
  const nav = await queryCollectionNavigation('spec')
  return nav ?? []
})
</script>

<template>
  <nav class="spec-toc">
    <h3 class="spec-toc__title">Table of Contents</h3>
    <ul v-if="navigation" class="spec-toc__list">
      <li v-for="item in navigation" :key="item.path" class="spec-toc__item">
        <NuxtLink
          :to="item.path"
          class="spec-toc__link"
          active-class="spec-toc__link--active"
        >
          {{ item.title }}
        </NuxtLink>
        <ul v-if="item.children?.length" class="spec-toc__sublist">
          <li v-for="child in item.children" :key="child.path">
            <NuxtLink
              :to="child.path"
              class="spec-toc__link spec-toc__link--sub"
              active-class="spec-toc__link--active"
            >
              {{ child.title }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
    <div class="spec-toc__actions">
      <NuxtLink to="/spec/print" class="spec-toc__print-link" target="_blank">
        View as single page
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.spec-toc__title {
  @apply text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3;
}

.spec-toc__list {
  @apply list-none p-0 m-0;
}

.spec-toc__sublist {
  @apply list-none p-0 m-0 pl-4 mt-0.5;
}

.spec-toc__item {
  @apply mb-0.5;
}

.spec-toc__link {
  @apply block px-3 py-1.5 text-sm rounded-md text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-colors;
}

.spec-toc__link--sub {
  @apply text-gray-500;
}

.spec-toc__link--active {
  @apply text-primary-700 bg-primary-50 font-medium;
}

.spec-toc__actions {
  @apply mt-6 pt-4 border-t border-gray-200;
}

.spec-toc__print-link {
  @apply text-xs text-gray-500 hover:text-primary-600 transition-colors;
}
</style>
