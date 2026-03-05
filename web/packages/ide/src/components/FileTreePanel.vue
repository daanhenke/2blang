<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useProject } from '../composables/useProject'

const projectState = useProject()

const creating = ref<'file' | 'folder' | null>(null)
const newName = ref('')
const inputEl = ref<HTMLInputElement>()

function selectFile(index: number) {
  const file = projectState.project.value.files[index]
  if (file) projectState.openTab(file.name)
}

function getFileIcon(name: string): string {
  if (name.endsWith('.2b')) return '{}'
  if (name.endsWith('.json')) return '{}'
  if (name.endsWith('.md')) return '#'
  if (name.endsWith('/')) return '/'
  return '~'
}

async function startCreate(type: 'file' | 'folder') {
  creating.value = type
  newName.value = type === 'folder' ? '' : ''
  await nextTick()
  inputEl.value?.focus()
}

function confirmCreate() {
  if (!newName.value.trim()) {
    cancelCreate()
    return
  }
  let name = newName.value.trim()
  if (creating.value === 'folder') {
    if (!name.endsWith('/')) name += '/'
  } else {
    if (!name.includes('.')) name += '.2b'
  }
  projectState.addFile(name, creating.value === 'folder' ? '' : '')
  cancelCreate()
}

function cancelCreate() {
  creating.value = null
  newName.value = ''
}

function onInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') confirmCreate()
  if (e.key === 'Escape') cancelCreate()
}

function deleteFile(index: number, e: MouseEvent) {
  e.stopPropagation()
  projectState.deleteFile(index)
}
</script>

<template>
  <div class="file-tree">
    <div class="file-tree__header">
      <span class="file-tree__title">{{ projectState.project.value.name || 'Files' }}</span>
      <div class="file-tree__actions">
        <button class="file-tree__action" title="New file" @click="startCreate('file')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </button>
        <button class="file-tree__action" title="New folder" @click="startCreate('folder')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        </button>
      </div>
    </div>
    <div class="file-tree__list">
      <button
        v-for="(file, i) in projectState.project.value.files"
        :key="file.name"
        class="file-tree__item"
        :class="{ 'file-tree__item--active': i === projectState.activeFileIndex.value }"
        @click="selectFile(i)"
      >
        <span class="file-tree__icon">{{ getFileIcon(file.name) }}</span>
        <span class="file-tree__name">{{ file.name }}</span>
        <button
          v-if="projectState.project.value.files.length > 1"
          class="file-tree__delete"
          title="Delete file"
          @click="deleteFile(i, $event)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </button>

      <!-- Inline create input -->
      <div v-if="creating" class="file-tree__create">
        <span class="file-tree__icon">{{ creating === 'folder' ? '/' : '{}' }}</span>
        <input
          ref="inputEl"
          v-model="newName"
          class="file-tree__create-input"
          :placeholder="creating === 'folder' ? 'folder name' : 'filename.2b'"
          @keydown="onInputKeydown"
          @blur="confirmCreate"
        >
      </div>
    </div>
  </div>
</template>

<style>
.file-tree {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--ide-mantle, #181825);
  color: var(--ide-text, #cdd6f4);
  overflow: hidden;
  min-width: 120px;
}

.file-tree__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px 6px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--ide-subtext0, #a6adc8);
  border-bottom: 1px solid var(--ide-surface0, #313244);
  flex-shrink: 0;
}

.file-tree__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-tree__actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.file-tree__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: none;
  border: none;
  border-radius: 3px;
  color: var(--ide-subtext0, #a6adc8);
  cursor: pointer;
  padding: 0;
}

.file-tree__action:hover {
  background: var(--ide-surface0, #313244);
  color: var(--ide-text, #cdd6f4);
}

.file-tree__action svg {
  width: 14px;
  height: 14px;
}

.file-tree__list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.file-tree__item {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 4px 12px;
  background: none;
  border: none;
  color: var(--ide-subtext1, #bac2de);
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  text-align: left;
  white-space: nowrap;
  position: relative;
}

.file-tree__item:hover {
  background: var(--ide-surface0, #313244);
}

.file-tree__item--active {
  background: var(--ide-surface0, #313244);
  color: var(--ide-text, #cdd6f4);
}

.file-tree__item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--ide-accent, #89b4fa);
}

.file-tree__icon {
  font-size: 12px;
  color: var(--ide-accent, #89b4fa);
  width: 16px;
  text-align: center;
  flex-shrink: 0;
  font-family: 'Cascadia Code', 'Fira Code', monospace;
}

.file-tree__name {
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.file-tree__delete {
  display: none;
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
  flex-shrink: 0;
}

.file-tree__item:hover .file-tree__delete {
  display: flex;
}

.file-tree__delete:hover {
  color: var(--ide-red, #f38ba8);
  background: var(--ide-surface1, #45475a);
}

.file-tree__delete svg {
  width: 12px;
  height: 12px;
}

.file-tree__create {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
}

.file-tree__create-input {
  flex: 1;
  background: var(--ide-surface0, #313244);
  color: var(--ide-text, #cdd6f4);
  border: 1px solid var(--ide-accent, #89b4fa);
  border-radius: 2px;
  padding: 2px 6px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  min-width: 0;
}
</style>
