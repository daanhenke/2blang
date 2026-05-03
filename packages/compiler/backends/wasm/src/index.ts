export interface WasmEmitOptions {
  readonly debug?: boolean
}

export interface WasmModule {
  readonly bytes: Uint8Array
}

export function emit(_options: WasmEmitOptions = {}): WasmModule
{
  return { bytes: new Uint8Array(0) }
}
