import { formatDiagnostic, type Diagnostic } from '@2blang/core'

export function renderDiagnostics(diags: readonly Diagnostic[]): string
{
  return diags.map(formatDiagnostic).join('\n')
}
