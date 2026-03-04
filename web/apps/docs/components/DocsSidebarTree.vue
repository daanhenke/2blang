<script setup lang="ts">
defineProps<{
  items: any[]
  depth?: number
}>()
</script>

<template>
  <ul class="sidebar-tree" :class="{ 'sidebar-tree--nested': depth }">
    <li v-for="item in items" :key="item.path" class="sidebar-tree__item">
      <NuxtLink
        v-if="item.path"
        :to="item.path"
        class="sidebar-tree__link"
        active-class="sidebar-tree__link--active"
      >
        {{ item.title }}
      </NuxtLink>
      <span v-else class="sidebar-tree__group-title">
        {{ item.title }}
      </span>
      <DocsSidebarTree
        v-if="item.children?.length"
        :items="item.children"
        :depth="(depth || 0) + 1"
      />
    </li>
  </ul>
</template>

<style scoped>
.sidebar-tree {
  @apply list-none p-0 m-0;
}

.sidebar-tree--nested {
  @apply pl-4 mt-1;
}

.sidebar-tree__item {
  @apply mb-0.5;
}

.sidebar-tree__link {
  @apply block px-3 py-1.5 rounded-md text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-colors;
}

.sidebar-tree__link--active {
  @apply text-primary-700 bg-primary-50 font-medium;
}

.sidebar-tree__group-title {
  @apply block px-3 py-1.5 font-semibold text-gray-900 text-xs uppercase tracking-wider mt-4 mb-1;
}
</style>
