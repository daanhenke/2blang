import { ref, watch, inject, provide, type InjectionKey, type Ref } from 'vue'
import * as monaco from 'monaco-editor'
import { themes, getThemeById, applyTheme, registerAllMonacoThemes, monacoThemeName, type IdeTheme } from '../themes'

export interface ThemeState {
  current: Ref<IdeTheme>
  setTheme: (id: string) => void
  themes: IdeTheme[]
  monacoThemeName: string
}

export const themeKey: InjectionKey<ThemeState> = Symbol('theme')

const STORAGE_KEY = '2b-ide-theme'
let monacoThemesRegistered = false

export function provideTheme(rootEl: Ref<HTMLElement | undefined>) {
  if (!monacoThemesRegistered) {
    registerAllMonacoThemes(monaco)
    monacoThemesRegistered = true
  }

  const savedId = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  const current = ref<IdeTheme>(getThemeById(savedId || 'catppuccin-mocha'))

  function setTheme(id: string) {
    current.value = getThemeById(id)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, id)
    }
  }

  watch([current, rootEl], ([theme, el]) => {
    if (el) applyTheme(theme, el)
  }, { immediate: true })

  const state: ThemeState = {
    current,
    setTheme,
    themes,
    get monacoThemeName() {
      return monacoThemeName(current.value)
    },
  }
  provide(themeKey, state)
  return state
}

export function useTheme(): ThemeState {
  const state = inject(themeKey)
  if (!state) throw new Error('useTheme() called without provideTheme()')
  return state
}
