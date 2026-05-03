import { describe, it, expect } from 'vitest'
import { run } from '../src/run.js'

describe('cli.run', () =>
{
  it('prints help when no args are given', () =>
  {
    const r = run([])
    expect(r.exitCode).toBe(0)
    expect(r.stdout).toContain('usage')
  })

  it('prints version with --version', () =>
  {
    const r = run(['--version'])
    expect(r.exitCode).toBe(0)
    expect(r.stdout).toContain('2blang')
  })

  it('exits non-zero on unknown command', () =>
  {
    const r = run(['frobnicate'])
    expect(r.exitCode).toBe(1)
  })
})
