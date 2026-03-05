import { ref, type InjectionKey, inject, provide, watch } from 'vue'
import type { CompileResult } from '../types/compiler'
import { compile } from '../compiler'

export interface CompilerState {
  result: ReturnType<typeof ref<CompileResult | null>>
  isCompiling: ReturnType<typeof ref<boolean>>
  autoCompile: ReturnType<typeof ref<boolean>>
  runCompile: (source: string) => void
  source: ReturnType<typeof ref<string>>
}

export const compilerKey: InjectionKey<CompilerState> = Symbol('compiler')

export function provideCompiler() {
  const result = ref<CompileResult | null>(null)
  const isCompiling = ref(false)
  const autoCompile = ref(true)
  const source = ref('')
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function runCompile(src: string) {
    isCompiling.value = true
    try {
      result.value = compile(src)
    }
    catch {
      result.value = null
    }
    finally {
      isCompiling.value = false
    }
  }

  watch(source, (newSource) => {
    if (!autoCompile.value) return
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => runCompile(newSource), 300)
  })

  const state: CompilerState = { result, isCompiling, autoCompile, runCompile, source }
  provide(compilerKey, state)
  return state
}

export function useCompiler(): CompilerState {
  const state = inject(compilerKey)
  if (!state) throw new Error('useCompiler() called without provideCompiler()')
  return state
}
