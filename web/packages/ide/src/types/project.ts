export interface ProjectFile {
  name: string
  content: string
}

export interface Project {
  id: string
  name: string
  files: ProjectFile[]
  openFiles?: string[]
}
