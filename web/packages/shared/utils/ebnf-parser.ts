/**
 * Lightweight W3C EBNF parser.
 *
 * Supported syntax:
 *   rule ::= expression
 *   "terminal" or 'terminal'
 *   rule_name (non-terminal reference)
 *   A B        (sequence / concatenation)
 *   A | B      (alternation / choice)
 *   ( A )      (grouping)
 *   A?         (optional)
 *   A*         (zero or more)
 *   A+         (one or more)
 *   /* comment * /
 */

export type EbnfNode =
  | { type: 'terminal', value: string }
  | { type: 'nonterminal', name: string }
  | { type: 'sequence', items: EbnfNode[] }
  | { type: 'choice', items: EbnfNode[] }
  | { type: 'optional', child: EbnfNode }
  | { type: 'repetition', child: EbnfNode, kind: '*' | '+' }
  | { type: 'group', child: EbnfNode }

interface Token {
  type: 'string' | 'name' | 'symbol'
  value: string
}

function tokenize(source: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < source.length) {
    // Skip whitespace
    if (/\s/.test(source[i]!)) {
      i++
      continue
    }

    // Skip block comments /* ... */
    if (source[i] === '/' && source[i + 1] === '*') {
      i += 2
      while (i < source.length - 1 && !(source[i] === '*' && source[i + 1] === '/'))
        i++
      i += 2
      continue
    }

    // Skip line comments // ...
    if (source[i] === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n')
        i++
      continue
    }

    // String literals
    if (source[i] === '"' || source[i] === '\'') {
      const quote = source[i]!
      let str = ''
      i++ // skip opening quote
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\' && i + 1 < source.length) {
          i++
        }
        str += source[i]
        i++
      }
      i++ // skip closing quote
      tokens.push({ type: 'string', value: str })
      continue
    }

    // ::= operator
    if (source[i] === ':' && source[i + 1] === ':' && source[i + 2] === '=') {
      tokens.push({ type: 'symbol', value: '::=' })
      i += 3
      continue
    }

    // Symbols
    if ('()|?*+'.includes(source[i]!)) {
      tokens.push({ type: 'symbol', value: source[i]! })
      i++
      continue
    }

    // Names (identifiers, possibly with hyphens/underscores)
    if (/[a-zA-Z_]/.test(source[i]!)) {
      let name = ''
      while (i < source.length && /[a-zA-Z0-9_\-]/.test(source[i]!)) {
        name += source[i]
        i++
      }
      tokens.push({ type: 'name', value: name })
      continue
    }

    // Skip unknown chars
    i++
  }

  return tokens
}

class Parser {
  private tokens: Token[]
  private pos = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  peek(): Token | undefined {
    return this.tokens[this.pos]
  }

  advance(): Token {
    return this.tokens[this.pos++]!
  }

  expect(type: string, value?: string): Token {
    const tok = this.advance()
    if (!tok || tok.type !== type || (value !== undefined && tok.value !== value)) {
      throw new Error(`Expected ${type}${value ? ` '${value}'` : ''}, got ${tok ? `${tok.type} '${tok.value}'` : 'EOF'}`)
    }
    return tok
  }

  atEnd(): boolean {
    return this.pos >= this.tokens.length
  }

  /** Parse all rules: name ::= expr */
  parseGrammar(): Map<string, EbnfNode> {
    const rules = new Map<string, EbnfNode>()
    while (!this.atEnd()) {
      const name = this.expect('name')
      this.expect('symbol', '::=')
      const expr = this.parseChoice()
      rules.set(name.value, expr)
    }
    return rules
  }

  /** Choice: expr ( '|' expr )* */
  parseChoice(): EbnfNode {
    const items: EbnfNode[] = [this.parseSequence()]
    while (this.peek()?.type === 'symbol' && this.peek()?.value === '|') {
      this.advance()
      items.push(this.parseSequence())
    }
    return items.length === 1 ? items[0]! : { type: 'choice', items }
  }

  /** Sequence: postfix+ */
  parseSequence(): EbnfNode {
    const items: EbnfNode[] = []
    while (!this.atEnd() && !(this.peek()?.type === 'symbol' && ['|', ')'].includes(this.peek()!.value)) && !(this.peek()?.type === 'name' && this.tokens[this.pos + 1]?.value === '::=')) {
      items.push(this.parsePostfix())
    }
    if (items.length === 0)
      throw new Error('Empty expression')
    return items.length === 1 ? items[0]! : { type: 'sequence', items }
  }

  /** Postfix: atom ('?' | '*' | '+')? */
  parsePostfix(): EbnfNode {
    let node = this.parseAtom()
    while (this.peek()?.type === 'symbol' && '?*+'.includes(this.peek()!.value)) {
      const op = this.advance().value
      if (op === '?') {
        node = { type: 'optional', child: node }
      }
      else {
        node = { type: 'repetition', child: node, kind: op as '*' | '+' }
      }
    }
    return node
  }

  /** Atom: string | name | '(' choice ')' */
  parseAtom(): EbnfNode {
    const tok = this.peek()
    if (!tok)
      throw new Error('Unexpected end of input')

    if (tok.type === 'string') {
      this.advance()
      return { type: 'terminal', value: tok.value }
    }

    if (tok.type === 'name') {
      this.advance()
      return { type: 'nonterminal', name: tok.value }
    }

    if (tok.type === 'symbol' && tok.value === '(') {
      this.advance()
      const child = this.parseChoice()
      this.expect('symbol', ')')
      return { type: 'group', child }
    }

    throw new Error(`Unexpected token: ${tok.type} '${tok.value}'`)
  }
}

/**
 * Parse a W3C EBNF source string into a map of rule names to AST nodes.
 */
export function parseEbnf(source: string): Map<string, EbnfNode> {
  const tokens = tokenize(source)
  const parser = new Parser(tokens)
  return parser.parseGrammar()
}
