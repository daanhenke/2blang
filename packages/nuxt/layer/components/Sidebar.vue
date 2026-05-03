<script setup lang="ts">
import { useAsyncData, queryCollectionNavigation, useRoute } from '#imports'
import { usePdfMode } from '../composables/usePdfMode'

interface NavNode {
  title: string
  path: string
  children?: NavNode[]
}

const route = useRoute()
const pdf = usePdfMode()
const { data: nav } = await useAsyncData('site-nav', () =>
  queryCollectionNavigation('content')
)
</script>

<template>
  <aside
    v-if="!pdf"
    class="hidden lg:block w-64 shrink-0 border-r border-gray-200 px-4 py-6 sticky top-14 self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto"
  >
    <ul class="text-sm space-y-1">
      <li
        v-for="node in (nav as NavNode[] | null) ?? []"
        :key="node.path"
      >
        <NuxtLink
          :to="node.path"
          :class="[
            'block px-2 py-1 rounded',
            route.path === node.path
              ? 'bg-brand-50 text-brand-900 font-medium'
              : 'hover:bg-gray-50',
          ]"
        >
          {{ node.title }}
        </NuxtLink>
        <ul
          v-if="node.children?.length"
          class="ml-3 mt-1 space-y-1"
        >
          <li
            v-for="child in node.children"
            :key="child.path"
          >
            <NuxtLink
              :to="child.path"
              :class="[
                'block px-2 py-1 rounded',
                route.path === child.path
                  ? 'bg-brand-50 text-brand-900 font-medium'
                  : 'hover:bg-gray-50',
              ]"
            >
              {{ child.title }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>
