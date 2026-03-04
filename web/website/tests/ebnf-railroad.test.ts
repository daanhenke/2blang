import { describe, it, expect } from 'vitest'
import { ebnfToSvg, ebnfToAllSvgs } from '../app/utils/ebnf-railroad'

const grammar = `
expression ::= term (("+" | "-") term)*
term       ::= factor (("*" | "/") factor)*
factor     ::= number | identifier | "(" expression ")"
number     ::= digit+
digit      ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
identifier ::= letter (letter | digit)*
letter     ::= "a" | "b" | "c"
`

describe('ebnfToSvg', () => {
  it('produces valid SVG for a simple rule', () => {
    const svg = ebnfToSvg(grammar, 'expression')
    expect(svg).toContain('<svg')
    expect(svg).toContain('</svg>')
  })

  it('renders terminal nodes', () => {
    const svg = ebnfToSvg(grammar, 'digit')
    expect(svg).toContain('<svg')
    // terminals like "0", "1", etc. should appear in the SVG
    expect(svg).toContain('0')
    expect(svg).toContain('1')
  })

  it('renders non-terminal references', () => {
    const svg = ebnfToSvg(grammar, 'expression')
    // "term" is referenced as a non-terminal
    expect(svg).toContain('term')
  })

  it('throws on unknown rule', () => {
    expect(() => ebnfToSvg(grammar, 'nonexistent')).toThrow(/not found/)
  })

  it('lists available rules in error message', () => {
    try {
      ebnfToSvg(grammar, 'nonexistent')
    } catch (e) {
      expect((e as Error).message).toContain('expression')
      expect((e as Error).message).toContain('term')
      expect((e as Error).message).toContain('factor')
    }
  })
})

describe('ebnfToAllSvgs', () => {
  it('returns SVGs for all named rules', () => {
    const svgs = ebnfToAllSvgs(grammar)
    expect(Object.keys(svgs)).toContain('expression')
    expect(Object.keys(svgs)).toContain('term')
    expect(Object.keys(svgs)).toContain('factor')
    expect(Object.keys(svgs)).toContain('number')
    expect(Object.keys(svgs)).toContain('digit')
    expect(Object.keys(svgs)).toContain('identifier')
    expect(Object.keys(svgs)).toContain('letter')
  })

  it('does not include internal helper rules', () => {
    const svgs = ebnfToAllSvgs(grammar)
    for (const key of Object.keys(svgs)) {
      expect(key).not.toMatch(/^%/)
    }
  })

  it('all values are valid SVG strings', () => {
    const svgs = ebnfToAllSvgs(grammar)
    for (const svg of Object.values(svgs)) {
      expect(svg).toContain('<svg')
      expect(svg).toContain('</svg>')
    }
  })
})
