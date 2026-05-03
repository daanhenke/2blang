export interface LlvmEmitOptions {
  readonly target?: string
}

export function emitText(_options: LlvmEmitOptions = {}): string
{
  return '; empty module\n'
}
