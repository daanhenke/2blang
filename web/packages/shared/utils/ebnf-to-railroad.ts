// @ts-expect-error -- railroad-diagrams v1.0.0 has no type declarations
import rr from 'railroad-diagrams'
import type { EbnfNode } from './ebnf-parser'
import { parseEbnf } from './ebnf-parser'

function toRailroad(node: EbnfNode): any {
  switch (node.type) {
    case 'terminal':
      return rr.Terminal(node.value)
    case 'nonterminal':
      return rr.NonTerminal(node.name)
    case 'sequence':
      return rr.Sequence(...node.items.map(toRailroad))
    case 'choice':
      return rr.Choice(0, ...node.items.map(toRailroad))
    case 'optional':
      return rr.Optional(toRailroad(node.child))
    case 'repetition':
      if (node.kind === '+')
        return rr.OneOrMore(toRailroad(node.child))
      return rr.ZeroOrMore(toRailroad(node.child))
    case 'group':
      return toRailroad(node.child)
  }
}

/**
 * Render a single EBNF rule to an SVG string.
 */
export function renderRule(grammarSource: string, ruleName: string): string {
  const rules = parseEbnf(grammarSource)
  const rule = rules.get(ruleName)
  if (!rule) {
    const available = [...rules.keys()].join(', ')
    throw new Error(`Rule "${ruleName}" not found. Available rules: ${available}`)
  }
  const diagram = rr.Diagram(toRailroad(rule))
  return diagram.toString()
}

/**
 * List all rule names in the grammar.
 */
export function listRules(grammarSource: string): string[] {
  return [...parseEbnf(grammarSource).keys()]
}
