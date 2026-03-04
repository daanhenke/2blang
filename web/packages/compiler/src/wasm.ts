import { type EmscriptenModule } from '../wasm/2bwasm.js'

export class WasmModuleWrapper {
  private module: EmscriptenModule

  private wrappedFree: (ptr: number) => void
  private wrappedCompile: (ptr: number) => string

  constructor(module: EmscriptenModule) {
    this.module = module
    this.wrappedFree = module.cwrap<(ptr: number) => void>('twob_free_ptr', null, ['number'])
    this.wrappedCompile = module.cwrap('twob_compile', 'string', ['number'])
  }

  compile() {
    this.wrappedCompile(1337)
  }

  private freePointer(ptr: number | undefined) {
    if (!ptr)
    {
      return
    }

    this.wrappedFree(ptr)
  }

  private readString(ptr: number, free: boolean = false): string | undefined {
    if (!ptr)
    {
      return undefined
    }

    try
    {
      return this.module.UTF8ToString(ptr)
    }
    finally
    {
      if (free)
      {
        this.freePointer(ptr)
      }
    }
  }
}
