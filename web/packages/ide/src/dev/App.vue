<script setup lang="ts">
import { ref, computed } from 'vue'
import { IdeEditor } from '../index'
import type { Project } from '../types/project'

// Built-in examples
const examples: Project[] = [
  {
    id: 'hello-world',
    name: 'Hello World',
    files: [{ name: 'main.2b', content: 'fn main() {\n  print("Hello, World!")\n}\n' }],
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci',
    files: [{ name: 'main.2b', content: 'fn fib(n: int) -> int {\n  if n <= 1 { return n }\n  return fib(n - 1) + fib(n - 2)\n}\n\nfn main() {\n  let result: int = fib(10)\n  print(result)\n}\n' }],
  },
  {
    id: 'multi-file',
    name: 'Multi-File Project',
    files: [
      { name: 'main.2b', content: 'import math\n\nfn main() {\n  let sum: int = math.add(2, 3)\n  print(sum)\n}\n' },
      { name: 'math.2b', content: 'fn add(a: int, b: int) -> int {\n  return a + b\n}\n\nfn multiply(a: int, b: int) -> int {\n  return a * b\n}\n' },
    ],
  },
]

const STORAGE_KEY = '2b-ide-projects'
const LAST_PROJECT_KEY = '2b-ide-last-project'

function loadCustomProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }
  catch {
    return []
  }
}

function saveCustomProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

const customProjects = ref<Project[]>(loadCustomProjects())
const allProjects = computed(() => [...examples, ...customProjects.value])

// Find last used project or default to first example
const lastId = localStorage.getItem(LAST_PROJECT_KEY)
const initial = allProjects.value.find(p => p.id === lastId) || examples[0]!
const currentProject = ref<Project>({ ...initial, files: initial.files.map(f => ({ ...f })) })

function selectProject(id: string) {
  const project = allProjects.value.find(p => p.id === id)
  if (project) {
    currentProject.value = { ...project, files: project.files.map(f => ({ ...f })) }
    localStorage.setItem(LAST_PROJECT_KEY, id)
  }
}

function createNewProject() {
  const id = `custom-${Date.now()}`
  const project: Project = {
    id,
    name: `Untitled ${customProjects.value.length + 1}`,
    files: [{ name: 'main.2b', content: 'fn main() {\n  \n}\n' }],
  }
  customProjects.value = [...customProjects.value, project]
  saveCustomProjects(customProjects.value)
  currentProject.value = { ...project, files: project.files.map(f => ({ ...f })) }
  localStorage.setItem(LAST_PROJECT_KEY, id)
}

function onProjectUpdate(project: Project) {
  currentProject.value = project

  // If it's an example that was edited, clone to custom
  const isExample = examples.some(e => e.id === project.id)
  if (isExample) {
    const original = examples.find(e => e.id === project.id)!
    const changed = JSON.stringify(original.files) !== JSON.stringify(project.files)
    if (changed) {
      const customId = `${project.id}-custom-${Date.now()}`
      const custom: Project = { ...project, id: customId, name: `${project.name} (modified)` }
      customProjects.value = [...customProjects.value, custom]
      saveCustomProjects(customProjects.value)
      currentProject.value = { ...custom, files: custom.files.map(f => ({ ...f })) }
      localStorage.setItem(LAST_PROJECT_KEY, customId)
      return
    }
  }

  // Save custom project updates
  const customIdx = customProjects.value.findIndex(p => p.id === project.id)
  if (customIdx >= 0) {
    customProjects.value[customIdx] = { ...project }
    saveCustomProjects(customProjects.value)
  }
}

function deleteProject(id: string) {
  customProjects.value = customProjects.value.filter(p => p.id !== id)
  saveCustomProjects(customProjects.value)
  if (currentProject.value.id === id) {
    selectProject(examples[0]!.id)
  }
}
</script>

<template>
  <div class="playground">
    <header class="playground__header">
      <div class="playground__header-left">
        <span class="playground__title">2b Playground</span>
        <select
          class="playground__select"
          :value="currentProject.id"
          @change="selectProject(($event.target as HTMLSelectElement).value)"
        >
          <optgroup label="Examples">
            <option v-for="ex in examples" :key="ex.id" :value="ex.id">
              {{ ex.name }}
            </option>
          </optgroup>
          <optgroup v-if="customProjects.length" label="Custom">
            <option v-for="cp in customProjects" :key="cp.id" :value="cp.id">
              {{ cp.name }}
            </option>
          </optgroup>
        </select>
        <button class="playground__btn" @click="createNewProject">
          + New
        </button>
        <button
          v-if="customProjects.some(p => p.id === currentProject.id)"
          class="playground__btn playground__btn--danger"
          @click="deleteProject(currentProject.id)"
        >
          Delete
        </button>
      </div>
    </header>
    <IdeEditor
      :project="currentProject"
      :examples="examples"
      class="playground__editor"
      @update:project="onProjectUpdate"
    />
  </div>
</template>

<style>
.playground {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: var(--ide-crust, #11111b);
  color: var(--ide-text, #cdd6f4);
  overflow: hidden;
}

.playground__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 12px;
  background: var(--ide-crust, #11111b);
  border-bottom: 1px solid var(--ide-surface0, #313244);
  flex-shrink: 0;
}

.playground__header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.playground__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ide-text, #cdd6f4);
}

.playground__select {
  background: var(--ide-surface0, #313244);
  color: var(--ide-text, #cdd6f4);
  border: 1px solid var(--ide-surface1, #45475a);
  border-radius: 3px;
  padding: 4px 8px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
}

.playground__select:focus {
  outline: 1px solid var(--ide-accent, #89b4fa);
}

.playground__btn {
  padding: 4px 10px;
  background: var(--ide-surface1, #45475a);
  color: var(--ide-text, #cdd6f4);
  border: 1px solid var(--ide-surface2, #585b70);
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
}

.playground__btn:hover {
  background: var(--ide-surface2, #585b70);
}

.playground__btn--danger:hover {
  background: var(--ide-red, #f38ba8);
  border-color: var(--ide-red, #f38ba8);
  color: var(--ide-crust, #11111b);
}

.playground__editor {
  flex: 1;
  min-height: 0;
}
</style>
