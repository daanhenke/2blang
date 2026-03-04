import createModule from '../wasm/2bwasm.js'
import { WasmModuleWrapper } from './wasm.js'

export type InitOptions = {
  wasmUrl?: string | URL
}

export async function loadModule(options: InitOptions = {}): Promise<WasmModuleWrapper> {
  const wasmUrl = String(options.wasmUrl ?? new URL('./2bwasm.wasm', import.meta.url).href)

  return new WasmModuleWrapper(await createModule({
    locateFile(path: string) {
      if (path.endsWith('.wasm')) {
        return wasmUrl
      }

      return path
    }
  }))
}
