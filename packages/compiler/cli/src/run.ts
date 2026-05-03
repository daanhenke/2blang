import { VERSION } from '@2blang/core'

export interface RunResult {
  readonly exitCode: number
  readonly stdout: string
}

export function run(argv: readonly string[]): RunResult
{
  if (argv.includes('--version') || argv.includes('-v'))
  {
    return { exitCode: 0, stdout: `2blang ${VERSION}\n` }
  }
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h'))
  {
    return {
      exitCode: 0,
      stdout: 'usage: 2b [--version] [--help] <command> [<args>]\n'
    }
  }
  return { exitCode: 1, stdout: `unknown command: ${argv[0]}\n` }
}
