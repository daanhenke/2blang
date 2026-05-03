import { describe, it, expect } from 'vitest'
import { renderDiagnostics } from '../src/index.js'

describe('renderDiagnostics', () =>
{
  it('joins diagnostics by newline', () =>
  {
    const out = renderDiagnostics([
      { severity: 'error', message: 'a' },
      { severity: 'warning', message: 'b' }
    ])
    expect(out).toBe('error: a\nwarning: b')
  })
})
