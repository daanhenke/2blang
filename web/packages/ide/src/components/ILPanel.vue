<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { useCompiler } from '../composables/useCompiler'
import { useTheme } from '../composables/useTheme'

const { result } = useCompiler()
const theme = useTheme()
const container = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(() => {
  if (!container.value) return
  editor = monaco.editor.create(container.value, {
    value: result.value?.il || '; No IL output yet',
    language: 'plaintext',
    theme: theme.monacoThemeName,
    readOnly: true,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 13,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    padding: { top: 8 },
    renderLineHighlight: 'none',
  })
})

watch(() => result.value?.il, (il) => {
  if (editor && il !== undefined) {
    editor.setValue(il)
  }
})

watch(() => theme.current.value, () => {
  if (editor) monaco.editor.setTheme(theme.monacoThemeName)
})

onBeforeUnmount(() => {
  editor?.dispose()
})
</script>

<template>
  <div ref="container" class="il-panel" />
</template>

<style>
.il-panel {
  height: 100%;
  background: var(--ide-base, #1e1e2e);
}
</style>
