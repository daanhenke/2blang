<script setup lang="ts">
import { ref, computed, provide, watch } from 'vue'
import type { Project } from './types/project'
import { projectKey } from './composables/useProject'
import { provideCompiler } from './composables/useCompiler'
import { provideTheme } from './composables/useTheme'
import Toolbar from './components/Toolbar.vue'
import GoldenLayoutWrapper from './layout/GoldenLayoutWrapper.vue'

const props = defineProps<{
  project: Project
  readOnly?: boolean
  examples?: Project[]
}>()

const emit = defineEmits<{
  'update:project': [project: Project]
}>()

const rootEl = ref<HTMLElement>()
const internalProject = ref<Project>({ ...props.project, files: props.project.files.map(f => ({ ...f })) })
const activeFileIndex = ref(0)
function initTabs(project: Project) {
  return project.openFiles?.length
    ? project.openFiles.filter(n => project.files.some(f => f.name === n))
    : project.files.length > 0 ? [project.files[0]!.name] : []
}

const openTabs = ref<string[]>(initTabs(props.project))

function addFile(name: string, content = '') {
  const exists = internalProject.value.files.some(f => f.name === name)
  if (exists) return
  internalProject.value.files = [...internalProject.value.files, { name, content }]
  activeFileIndex.value = internalProject.value.files.length - 1
  openTab(name)
}

function deleteFile(index: number) {
  if (internalProject.value.files.length <= 1) return
  const fileName = internalProject.value.files[index]?.name
  internalProject.value.files = internalProject.value.files.filter((_, i) => i !== index)
  if (fileName) {
    openTabs.value = openTabs.value.filter(n => n !== fileName)
  }
  if (activeFileIndex.value >= internalProject.value.files.length) {
    activeFileIndex.value = internalProject.value.files.length - 1
  }
}

function renameFile(index: number, newName: string) {
  const file = internalProject.value.files[index]
  if (!file) return
  const exists = internalProject.value.files.some((f, i) => i !== index && f.name === newName)
  if (exists) return
  const oldName = file.name
  file.name = newName
  const tabIdx = openTabs.value.indexOf(oldName)
  if (tabIdx >= 0) {
    openTabs.value[tabIdx] = newName
  }
}

function openTab(name: string) {
  if (!openTabs.value.includes(name)) {
    openTabs.value = [...openTabs.value, name]
  }
  const fileIdx = internalProject.value.files.findIndex(f => f.name === name)
  if (fileIdx >= 0) {
    activeFileIndex.value = fileIdx
  }
}

function closeTab(name: string) {
  const tabIdx = openTabs.value.indexOf(name)
  if (tabIdx < 0) return
  openTabs.value = openTabs.value.filter(n => n !== name)
  // If we closed the active file, switch to an adjacent open tab
  const activeFile = internalProject.value.files[activeFileIndex.value]
  if (activeFile?.name === name) {
    if (openTabs.value.length > 0) {
      // Pick the tab that was next to the closed one
      const nextTab = openTabs.value[Math.min(tabIdx, openTabs.value.length - 1)]!
      const nextIdx = internalProject.value.files.findIndex(f => f.name === nextTab)
      if (nextIdx >= 0) activeFileIndex.value = nextIdx
    }
  }
}

const examples = computed(() => props.examples ?? [])

function resetProject() {
  internalProject.value = { ...props.project, files: props.project.files.map(f => ({ ...f })) }
  activeFileIndex.value = 0
  openTabs.value = initTabs(props.project)
}

function loadProject(project: Project) {
  internalProject.value = { ...project, files: project.files.map(f => ({ ...f })) }
  activeFileIndex.value = 0
  openTabs.value = initTabs(project)
  emit('update:project', internalProject.value)
}

provide(projectKey, {
  project: internalProject, activeFileIndex, openTabs, examples,
  addFile, deleteFile, renameFile, openTab, closeTab,
  resetProject, loadProject,
})
provideCompiler()
provideTheme(rootEl)

// Sync inbound prop changes
watch(() => props.project, (newProject) => {
  internalProject.value = { ...newProject, files: newProject.files.map(f => ({ ...f })) }
  activeFileIndex.value = 0
  openTabs.value = initTabs(newProject)
}, { deep: true })

// Emit outbound changes
watch(internalProject, (project) => {
  emit('update:project', project)
}, { deep: true })
</script>

<template>
  <div ref="rootEl" class="ide-editor">
    <Toolbar />
    <GoldenLayoutWrapper class="ide-editor__layout" />
  </div>
</template>

<style>
.ide-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--ide-base, #1e1e2e);
  color: var(--ide-text, #cdd6f4);
}

.ide-editor__layout {
  flex: 1;
  min-height: 0;
}
</style>
