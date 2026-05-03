import { describe, it, expect } from 'vitest'
import { formatDiagnostic } from '../src/diagnostics.js'

describe('formatDiagnostic', () =>
{
  it('formats a diagnostic with no location', () =>
  {
    expect(formatDiagnostic({ severity: 'error', message: 'boom' })).toBe('error: boom')
  })

  it('formats a diagnostic with a file location', () =>
  {
    expect(
      formatDiagnostic({
        severity: 'warning',
        message: 'careful',
        file: 'a.2b',
        line: 3,
        column: 7
      })
    ).toBe('a.2b:3:7: warning: careful')
  })
})
