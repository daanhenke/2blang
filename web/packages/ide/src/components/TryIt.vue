<script setup lang="ts">
import { ref, shallowRef, watch, onMounted, onBeforeUnmount, markRaw } from 'vue'
import type { Project } from '../types/project'

const props = defineProps<{
  project?: Project
  src?: string
  label?: string
}>()

const open = ref(false)
const loaded = ref<Project | null>(props.project ?? null)
const error = ref<string | null>(null)
const ideReady = ref(false)
const IdeEditor = shallowRef<any>(null)

async function fetchProject() {
  if (props.project) {
    loaded.value = props.project
    return
  }
  if (!props.src) return
  try {
    const res = await fetch(props.src)
    if (!res.ok) throw new Error(`Failed to load project: ${res.status}`)
    loaded.value = await res.json()
  }
  catch (e: any) {
    error.value = e.message
  }
}

async function loadIde() {
  if (ideReady.value) return
  const [mod] = await Promise.all([
    import('../IdeEditor.vue'),
    import('../editor/monaco-setup'),
    import('golden-layout/dist/css/goldenlayout-base.css'),
    import('golden-layout/dist/css/themes/goldenlayout-dark-theme.css'),
    import('../styles/golden-layout.css'),
  ])
  IdeEditor.value = markRaw(mod.default)
  ideReady.value = true
}

watch(() => props.src, fetchProject)
watch(() => props.project, (p) => { if (p) loaded.value = p })

async function openModal() {
  open.value = true
  document.body.style.overflow = 'hidden'
  if (!loaded.value) await fetchProject()
  await loadIde()
}

function closeModal() {
  open.value = false
  document.body.style.overflow = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeModal()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <button class="try-it-btn" @click="openModal">
    <svg class="try-it-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
    {{ label || 'Try it' }}
  </button>

  <Teleport to="body">
    <Transition name="try-it-fade">
      <div v-if="open" class="try-it-overlay" @click.self="closeModal">
        <div class="try-it-modal">
          <button class="try-it-modal__close" @click="closeModal" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div v-if="error" class="try-it-modal__error">{{ error }}</div>
          <component
            :is="IdeEditor"
            v-else-if="ideReady && loaded"
            :project="loaded"
            class="try-it-modal__editor"
          />
          <div v-else class="try-it-modal__loading">Loading IDE...</div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.try-it-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: var(--ide-accent, #89b4fa);
  color: var(--ide-crust, #11111b);
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.try-it-btn:hover {
  background: var(--ide-accent-hover, #b4befe);
}

.try-it-btn__icon {
  width: 16px;
  height: 16px;
}

.try-it-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 16px;
}

.try-it-modal {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1400px;
  max-height: 900px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
}

@media (min-width: 768px) {
  .try-it-modal {
    width: 92%;
    height: 88%;
  }
}

.try-it-modal__close {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  border-radius: 6px;
  color: #ccc;
  cursor: pointer;
  transition: background 0.15s;
}

.try-it-modal__close:hover {
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
}

.try-it-modal__close svg {
  width: 18px;
  height: 18px;
}

.try-it-modal__editor {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.try-it-modal__loading,
.try-it-modal__error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #1e1e2e;
  color: #cdd6f4;
  font-size: 14px;
}

.try-it-modal__error {
  color: #f38ba8;
}

/* Transition */
.try-it-fade-enter-active,
.try-it-fade-leave-active {
  transition: opacity 0.2s ease;
}

.try-it-fade-enter-active .try-it-modal,
.try-it-fade-leave-active .try-it-modal {
  transition: transform 0.2s ease;
}

.try-it-fade-enter-from,
.try-it-fade-leave-to {
  opacity: 0;
}

.try-it-fade-enter-from .try-it-modal {
  transform: scale(0.95);
}

.try-it-fade-leave-to .try-it-modal {
  transform: scale(0.95);
}
</style>
