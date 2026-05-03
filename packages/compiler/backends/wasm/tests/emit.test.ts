import { describe, it, expect } from 'vitest'
import { emit } from '../src/index.js'

describe('wasm.emit', () =>
{
  it('returns a module with a Uint8Array of bytes', () =>
  {
    const mod = emit()
    expect(mod.bytes).toBeInstanceOf(Uint8Array)
  })
})
