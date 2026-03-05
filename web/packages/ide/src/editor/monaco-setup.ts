import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

if (typeof self !== 'undefined') {
  self.MonacoEnvironment = {
    getWorker() {
      return new editorWorker()
    },
  }
}
