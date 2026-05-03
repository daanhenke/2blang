import { describe, it, expect } from 'vitest'
import { emitText } from '../src/index.js'

describe('llvm.emitText', () =>
{
  it('returns a string', () =>
  {
    expect(typeof emitText()).toBe('string')
  })
})
