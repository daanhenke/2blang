<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { useProject } from '../composables/useProject'
import { useCompiler } from '../composables/useCompiler'
import { useTheme } from '../composables/useTheme'

const projectState = useProject()
const compiler = useCompiler()
const theme = useTheme()

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null
const models = new Map<string, monaco.editor.ITextModel>()

// Resolve open tab names to file objects
const tabFiles = computed(() =>
  projectState.openTabs.value
    .map(name => projectState.project.value.files.find(f => f.name === name))
    .filter(Boolean) as { name: string; content: string }[]
)

function syncModels() {
  const fileNames = new Set(projectState.project.value.files.map(f => f.name))

  // Remove models for deleted files
  for (const [name, model] of models) {
    if (!fileNames.has(name)) {
      model.dispose()
      models.delete(name)
    }
  }

  // Create or update models for current files
  for (const file of projectState.project.value.files) {
    let model = models.get(file.name)
    if (!model) {
      model = monaco.editor.createModel(file.content, undefined, monaco.Uri.parse(`file:///${file.name}`))
      model.onDidChangeContent(() => {
        const f = projectState.project.value.files.find(f => f.name === file.name)
        if (f) {
          f.content = model!.getValue()
          compiler.source.value = getActiveSource()
        }
      })
      models.set(file.name, model)
    }
    else if (model.getValue() !== file.content) {
      model.setValue(file.content)
    }
  }
}

function getActiveSource(): string {
  const file = projectState.project.value.files[projectState.activeFileIndex.value]
  return file ? models.get(file.name)?.getValue() || file.content : ''
}

function switchToFile(name: string) {
  projectState.openTab(name)
  const file = projectState.project.value.files.find(f => f.name === name)
  if (file && editor) {
    const model = models.get(file.name)
    if (model) editor.setModel(model)
  }
}

function closeTab(name: string, e: MouseEvent) {
  e.stopPropagation()
  projectState.closeTab(name)
}

onMounted(() => {
  if (!editorContainer.value) return
  editor = monaco.editor.create(editorContainer.value, {
    theme: theme.monacoThemeName,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    padding: { top: 8 },
  })

  syncModels()
  const firstFile = projectState.project.value.files[0]
  if (firstFile) {
    const model = models.get(firstFile.name)
    if (model) editor.setModel(model)
  }

  compiler.source.value = getActiveSource()
})

// Switch Monaco theme when IDE theme changes
watch(() => theme.current.value, () => {
  monaco.editor.setTheme(theme.monacoThemeName)
})

watch(() => projectState.project.value, () => {
  syncModels()
}, { deep: true })

// Respond to active file changes (from file tree or tab clicks)
watch(() => projectState.activeFileIndex.value, (index) => {
  const file = projectState.project.value.files[index]
  if (file && editor) {
    const model = models.get(file.name)
    if (model) editor.setModel(model)
    compiler.source.value = getActiveSource()
  }
})

onBeforeUnmount(() => {
  editor?.dispose()
  for (const model of models.values()) model.dispose()
  models.clear()
})
</script>

<template>
  <div class="editor-panel">
    <div class="editor-tabs">
      <div
        v-for="file in tabFiles"
        :key="file.name"
        class="editor-tab"
        :class="{ active: projectState.project.value.files[projectState.activeFileIndex.value]?.name === file.name }"
        @click="switchToFile(file.name)"
      >
        <span class="editor-tab__name">{{ file.name }}</span>
        <button
          v-if="tabFiles.length > 1"
          class="editor-tab__close"
          title="Close"
          @click="closeTab(file.name, $event)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
    <div ref="editorContainer" class="editor-container" />
  </div>
</template>

<style>
.editor-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--ide-base, #1e1e2e);
}

.editor-tabs {
  display: flex;
  background: var(--ide-mantle, #181825);
  border-bottom: 1px solid var(--ide-surface1, #45475a);
  overflow-x: auto;
  flex-shrink: 0;
}

.editor-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 6px 16px;
  background: var(--ide-surface0, #313244);
  color: var(--ide-subtext0, #a6adc8);
  border: none;
  border-right: 1px solid var(--ide-surface1, #45475a);
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  white-space: nowrap;
}

.editor-tab:hover {
  background: var(--ide-surface1, #45475a);
}

.editor-tab.active {
  background: var(--ide-base, #1e1e2e);
  color: var(--ide-text, #cdd6f4);
  border-bottom: 1px solid var(--ide-base, #1e1e2e);
  margin-bottom: -1px;
}

.editor-tab__name {
  overflow: hidden;
  text-overflow: ellipsis;
}

.editor-tab__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: none;
  border: none;
  border-radius: 3px;
  color: var(--ide-overlay1, #7f849c);
  cursor: pointer;
  padding: 0;
  opacity: 0;
  flex-shrink: 0;
}

.editor-tab:hover .editor-tab__close,
.editor-tab.active .editor-tab__close {
  opacity: 1;
}

.editor-tab__close:hover {
  color: var(--ide-text, #cdd6f4);
  background: var(--ide-surface2, #585b70);
}

.editor-tab__close svg {
  width: 12px;
  height: 12px;
}

.editor-container {
  flex: 1;
  min-height: 0;
}
</style>
