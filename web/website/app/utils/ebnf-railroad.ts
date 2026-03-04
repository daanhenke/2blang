import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

import rr from 'railroad-diagrams'
import { Grammars } from 'ebnf'

const { Diagram, Terminal, NonTerminal, Sequence, Choice, OneOrMore, ZeroOrMore } = rr

interface BnfRule {
  name: string
  bnf: string[][]
}

function findRuleByName(rules: BnfRule[], name: string): BnfRule | undefined {
  return rules.find((r) => r.name === name)
}

function bnfTokenToDiagram(token: string, rules: BnfRule[]): any {
  // Quoted terminal: "foo"
  if (token.startsWith('"') && token.endsWith('"')) {
    return Terminal(token.slice(1, -1))
  }

  // One-or-more: name+
  if (token.endsWith('+')) {
    const base = token.slice(0, -1)
    return OneOrMore(bnfTokenToDiagram(base, rules))
  }

  // Zero-or-more: name*
  if (token.endsWith('*')) {
    const base = token.slice(0, -1)
    return ZeroOrMore(bnfTokenToDiagram(base, rules))
  }

  // Internal helper rule (starts with % or %%): inline it
  if (token.startsWith('%')) {
    const rule = findRuleByName(rules, token)
    if (rule) {
      return bnfRuleToDiagram(rule, rules)
    }
  }

  // Named rule reference
  return NonTerminal(token)
}

function bnfRuleToDiagram(rule: BnfRule, rules: BnfRule[]): any {
  const alternatives = rule.bnf

  const altDiagrams = alternatives.map((seq) => {
    const items = seq.map((token) => bnfTokenToDiagram(token, rules))
    return items.length === 1 ? items[0] : Sequence(...items)
  })

  if (altDiagrams.length === 1) {
    return altDiagrams[0]
  }

  return Choice(0, ...altDiagrams)
}

export function ebnfToSvg(ebnfContent: string, ruleName: string): string {
  const parser = new Grammars.W3C.Parser(ebnfContent)
  const rules = parser.grammarRules as BnfRule[]

  const rule = findRuleByName(rules, ruleName)
  if (!rule) {
    const available = Object.values(rules)
      .filter((r) => !r.name.startsWith('%'))
      .map((r) => r.name)
    throw new Error(
      `Rule "${ruleName}" not found in EBNF. Available rules: ${available.join(', ')}`,
    )
  }

  const diagram = bnfRuleToDiagram(rule, rules)
  const d = Diagram(diagram)
  return d.toString()
}

export function ebnfToAllSvgs(ebnfContent: string): Record<string, string> {
  const parser = new Grammars.W3C.Parser(ebnfContent)
  const rules = parser.grammarRules as BnfRule[]
  const result: Record<string, string> = {}

  for (const rule of rules) {
    if (rule.name.startsWith('%')) continue
    const diagram = bnfRuleToDiagram(rule, rules)
    const d = Diagram(diagram)
    result[rule.name] = d.toString()
  }

  return result
}
