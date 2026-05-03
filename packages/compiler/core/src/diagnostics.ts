export type DiagnosticSeverity = 'error' | 'warning' | 'info'

export interface Diagnostic {
  readonly severity: DiagnosticSeverity
  readonly message: string
  readonly file?: string
  readonly line?: number
  readonly column?: number
}

export function formatDiagnostic(d: Diagnostic): string
{
  const loc = d.file ? `${d.file}:${d.line ?? 0}:${d.column ?? 0}: ` : ''
  return `${loc}${d.severity}: ${d.message}`
}
