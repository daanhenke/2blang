import { inject, type InjectionKey, type Ref } from 'vue'
import type { Project } from '../types/project'

export interface ProjectState {
  project: Ref<Project>
  activeFileIndex: Ref<number>
  openTabs: Ref<string[]>
  examples: Ref<Project[]>
  addFile: (name: string, content?: string) => void
  deleteFile: (index: number) => void
  renameFile: (index: number, newName: string) => void
  openTab: (name: string) => void
  closeTab: (name: string) => void
  resetProject: () => void
  loadProject: (project: Project) => void
}

export const projectKey: InjectionKey<ProjectState> = Symbol('project')

export function useProject(): ProjectState {
  const state = inject(projectKey)
  if (!state) throw new Error('useProject() called without providing project state')
  return state
}
