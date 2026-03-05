<script setup lang="ts">
import { computed } from 'vue'
import { useCompiler } from '../composables/useCompiler'
import { useTheme } from '../composables/useTheme'
import { useProject } from '../composables/useProject'
import MainMenu from './MainMenu.vue'
import type { Menu } from './MainMenu.vue'

const compiler = useCompiler()
const theme = useTheme()
const projectState = useProject()

function handleCompile() {
  compiler.runCompile(compiler.source.value)
}

const menus = computed<Menu[]>(() => [
  {
    label: 'File',
    items: [
      ...(projectState.examples.value.length > 0
        ? [{
            label: 'Examples',
            items: projectState.examples.value.map(ex => ({
              label: ex.name,
              action: () => projectState.loadProject(ex),
            })),
          },
          { label: '', separator: true },
        ] as const
        : []),
      {
        label: 'Reset Project',
        action: () => projectState.resetProject(),
      },
    ],
  },
  {
    label: 'Build',
    items: [
      {
        label: 'Compile',
        action: handleCompile,
        disabled: compiler.isCompiling.value,
      },
      { label: '', separator: true },
      {
        label: 'Auto Compile',
        checked: compiler.autoCompile.value,
        action: () => { compiler.autoCompile.value = !compiler.autoCompile.value },
      },
    ],
  },
  {
    label: 'View',
    items: [
      {
        label: 'Theme',
        items: theme.themes.map(t => ({
          label: t.name,
          checked: theme.current.value.id === t.id,
          action: () => theme.setTheme(t.id),
        })),
      },
    ],
  },
])
</script>

<template>
  <div class="ide-toolbar">
    <div class="ide-toolbar__left">
      <span class="ide-toolbar__brand">2b IDE</span>
      <MainMenu :menus="menus" />
    </div>
    <div class="ide-toolbar__right">
      <button
        class="ide-toolbar__btn"
        :disabled="compiler.isCompiling.value"
        @click="handleCompile"
      >
        {{ compiler.isCompiling.value ? 'Compiling...' : 'Compile' }}
      </button>
    </div>
  </div>
</template>

<style>
.ide-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 12px;
  background: var(--ide-mantle, #181825);
  border-bottom: 1px solid var(--ide-surface1, #45475a);
  flex-shrink: 0;
}

.ide-toolbar__left {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
}

.ide-toolbar__brand {
  font-size: 14px;
  font-weight: 600;
  color: var(--ide-text, #cdd6f4);
  letter-spacing: 0.5px;
}

.ide-toolbar__right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ide-toolbar__btn {
  padding: 4px 14px;
  background: var(--ide-accent, #89b4fa);
  color: var(--ide-crust, #11111b);
  border: none;
  border-radius: 3px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
}

.ide-toolbar__btn:hover {
  background: var(--ide-accent-hover, #b4befe);
}

.ide-toolbar__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
