<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { useContentSearch } from '../composables/useContentSearch'
import { useSiteContext } from '../composables/useSiteContext'

const open = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)
const { query, results } = useContentSearch()
const { features, pdfMode } = useSiteContext()

function onKeydown(event: KeyboardEvent)
{
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')
  {
    event.preventDefault()
    open.value = !open.value
  }
  if (event.key === 'Escape' && open.value)
  {
    open.value = false
  }
}

watch(open, async (next) =>
{
  if (next)
  {
    await nextTick()
    inputEl.value?.focus()
  }
  else
  {
    query.value = ''
  }
})

onMounted(() =>
{
  if (!features.value.search) return
  if (typeof window !== 'undefined') window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() =>
{
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
})

defineExpose({ open: () => (open.value = true) })
</script>

<template>
  <div v-if="features.search && !pdfMode">
    <button
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
      type="button"
      @click="open = true"
    >
      <span class="i-lucide-search w-4 h-4" />
      <span>Search</span>
      <span class="ml-2 flex gap-1">
        <UiKbd>{{ '⌘' }}</UiKbd><UiKbd>K</UiKbd>
      </span>
    </button>
    <Teleport
      v-if="open"
      to="body"
    >
      <div
        class="fixed inset-0 bg-black/40 flex items-start justify-center pt-24 z-50"
        @click.self="open = false"
      >
        <div class="bg-white w-full max-w-xl rounded-lg shadow-xl flex flex-col">
          <div class="border-b border-gray-200 p-3">
            <UiInput
              ref="inputEl"
              v-model="query"
              placeholder="Search content…"
              type="search"
            />
          </div>
          <ul class="max-h-96 overflow-y-auto py-1">
            <li
              v-if="!results.length && query"
              class="px-4 py-3 text-sm text-gray-500"
            >
              No matches for "{{ query }}".
            </li>
            <li
              v-for="hit in results"
              :key="hit.id"
            >
              <NuxtLink
                :to="hit.id"
                class="block px-4 py-2 hover:bg-gray-50"
                @click="open = false"
              >
                <div class="text-sm font-medium">
                  {{ hit.title || hit.id }}
                </div>
                <div
                  v-if="hit.content"
                  class="text-xs text-gray-500 line-clamp-2"
                >
                  {{ hit.content }}
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </Teleport>
  </div>
</template>
