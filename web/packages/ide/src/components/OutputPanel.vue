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
    value: result.value?.executable || '; No output yet',
    language: 'plaintext',
    theme: theme.monacoThemeName,
    readOnly: true,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 13,
    lineNumbers: 'off',
    scrollBeyondLastLine: false,
    padding: { top: 8 },
    renderLineHighlight: 'none',
    wordWrap: 'on',
  })
})

watch(() => result.value?.executable, (exe) => {
  if (editor && exe !== undefined) {
    editor.setValue(exe)
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
  <div ref="container" class="output-panel" />
</template>

<style>
.output-panel {
  height: 100%;
  background: var(--ide-base, #1e1e2e);
}
</style>
