<script setup lang="ts">
const query = ref('')
const isOpen = ref(false)
const results = ref<any[]>([])

async function search() {
  if (!query.value.trim()) {
    results.value = []
    return
  }
  const data = await queryCollectionSearchSections('docs', query.value)
  results.value = data
}

watch(query, search)

function open() {
  isOpen.value = true
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>('.search-dialog__input')
    input?.focus()
  })
}

function close() {
  isOpen.value = false
  query.value = ''
  results.value = []
}

// Keyboard shortcut: Ctrl+K / Cmd+K
if (import.meta.client) {
  useEventListener(document, 'keydown', (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      isOpen.value ? close() : open()
    }
    if (e.key === 'Escape' && isOpen.value) {
      close()
    }
  })
}
</script>

<template>
  <div>
    <button class="search-trigger" @click="open">
      <span class="search-trigger__text">Search docs...</span>
      <kbd class="search-trigger__kbd">⌘K</kbd>
    </button>

    <Teleport to="body">
      <div v-if="isOpen" class="search-overlay" @click.self="close">
        <div class="search-dialog">
          <input
            v-model="query"
            class="search-dialog__input"
            placeholder="Search documentation..."
            type="search"
          >
          <div class="search-dialog__results">
            <template v-if="results.length">
              <NuxtLink
                v-for="result in results"
                :key="result.id"
                :to="result.path"
                class="search-dialog__result"
                @click="close"
              >
                <span class="search-dialog__result-title">{{ result.title }}</span>
                <span
                  v-if="result.titles?.length"
                  class="search-dialog__result-breadcrumb"
                >
                  {{ result.titles.join(' › ') }}
                </span>
              </NuxtLink>
            </template>
            <div v-else-if="query.trim()" class="search-dialog__empty">
              No results found.
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.search-trigger {
  @apply flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 rounded-md;
  @apply hover:bg-gray-200 transition-colors cursor-pointer border-none;
}

.search-trigger__text {
  @apply hidden sm:inline;
}

.search-trigger__kbd {
  @apply text-xs bg-white px-1.5 py-0.5 rounded border border-gray-300 text-gray-400 font-mono;
}

.search-overlay {
  @apply fixed inset-0 z-[100] bg-black/50 flex items-start justify-center pt-[15vh];
}

.search-dialog {
  @apply bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden;
}

.search-dialog__input {
  @apply w-full px-5 py-4 text-base border-none outline-none border-b border-gray-200;
}

.search-dialog__results {
  @apply max-h-80 overflow-y-auto;
}

.search-dialog__result {
  @apply block px-5 py-3 hover:bg-primary-50 transition-colors;
}

.search-dialog__result-title {
  @apply block text-sm font-medium text-gray-900;
}

.search-dialog__result-breadcrumb {
  @apply block text-xs text-gray-500 mt-0.5;
}

.search-dialog__empty {
  @apply px-5 py-8 text-center text-sm text-gray-500;
}
</style>
