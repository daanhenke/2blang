<script setup lang="ts">
import { computed, shallowRef, markRaw, onMounted } from 'vue'

interface ProjectFile { name: string; content: string }
interface Project { id: string; name: string; files: ProjectFile[] }

const props = defineProps<{
  project?: Project
  src?: string
  label?: string
}>()

const {
  app: { baseURL },
} = useRuntimeConfig()

const resolvedProps = computed(() => {
  if (!props.src?.startsWith('/')) return props

  return {
    ...props,
    src: `${baseURL}${props.src.slice(1)}`,
  }
})

const TryItComponent = shallowRef<any>(null)

onMounted(async () => {
  // Lightweight import — TryIt defers Monaco/GL loading to click-time
  const mod = await import('@2b/ide/try-it')
  TryItComponent.value = markRaw(mod.TryIt)
})
</script>

<template>
  <component
    :is="TryItComponent"
    v-if="TryItComponent"
    v-bind="resolvedProps"
  />
  <button v-else class="ide-try-it-placeholder" disabled>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
    {{ label || 'Try it' }}
  </button>
</template>

<style>
.ide-try-it-placeholder {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: #45475a;
  color: #cdd6f4;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: wait;
  font-family: inherit;
  opacity: 0.7;
}
</style>
