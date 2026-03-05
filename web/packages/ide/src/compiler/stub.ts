import type { ASTNode, CompileResult } from '../types/compiler'

function extractIdentifiers(source: string): string[] {
  const matches = source.match(/\b[a-zA-Z_]\w*\b/g) || []
  const keywords = new Set(['fn', 'let', 'if', 'else', 'return', 'while', 'for', 'import', 'true', 'false', 'int', 'string', 'bool', 'void'])
  return [...new Set(matches.filter(m => !keywords.has(m)))]
}

function buildFakeAST(source: string): ASTNode {
  const lines = source.split('\n').filter(l => l.trim())
  const identifiers = extractIdentifiers(source)
  const children: ASTNode[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim()
    if (line.startsWith('fn ')) {
      const name = line.match(/fn\s+(\w+)/)?.[1] || 'unknown'
      children.push({
        type: 'FunctionDecl',
        value: name,
        line: i + 1,
        column: 0,
        children: [
          { type: 'Identifier', value: name, line: i + 1, column: 3 },
          { type: 'Block', line: i + 1, column: line.indexOf('{'), children: [
            { type: 'Statement', value: 'body', line: i + 2, column: 2 },
          ] },
        ],
      })
    }
    else if (line.startsWith('let ')) {
      const name = line.match(/let\s+(\w+)/)?.[1] || 'x'
      children.push({
        type: 'LetStatement',
        line: i + 1,
        column: 0,
        children: [
          { type: 'Identifier', value: name, line: i + 1, column: 4 },
          { type: 'Expression', value: 'initializer', line: i + 1, column: line.indexOf('=') + 2 },
        ],
      })
    }
    else if (line.startsWith('if ')) {
      children.push({
        type: 'IfStatement',
        line: i + 1,
        column: 0,
        children: [
          { type: 'Condition', value: 'expr', line: i + 1, column: 3 },
          { type: 'ThenBlock', line: i + 1, children: [] },
        ],
      })
    }
    else if (line.startsWith('return')) {
      children.push({ type: 'ReturnStatement', line: i + 1, column: 0, children: [
        { type: 'Expression', value: line.slice(7).replace(';', '').trim() || 'void', line: i + 1, column: 7 },
      ] })
    }
    else if (line !== '{' && line !== '}' && line.length > 0) {
      children.push({ type: 'ExpressionStatement', value: line.slice(0, 30), line: i + 1, column: 0 })
    }
  }

  return {
    type: 'Program',
    children: children.length > 0 ? children : [
      { type: 'EmptyProgram', value: identifiers[0] || '(empty)' },
    ],
  }
}

function buildFakeIL(source: string): string {
  const lines = source.split('\n').filter(l => l.trim())
  const identifiers = extractIdentifiers(source)
  const output: string[] = ['; 2b intermediate representation', '']

  let funcName = 'main'
  let reg = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('fn ')) {
      funcName = trimmed.match(/fn\s+(\w+)/)?.[1] || 'unknown'
      output.push(`.func ${funcName}`)
      reg = 0
    }
    else if (trimmed.startsWith('let ')) {
      const name = trimmed.match(/let\s+(\w+)/)?.[1] || 'x'
      output.push(`  ALLOC   r${reg}          ; ${name}`)
      output.push(`  STORE   r${reg}, <init>`)
      reg++
    }
    else if (trimmed.startsWith('return')) {
      const expr = trimmed.slice(7).replace(';', '').trim()
      if (expr) {
        output.push(`  LOAD    r${reg}, ${expr}`)
        output.push(`  RET     r${reg}`)
      }
      else {
        output.push('  RET     void')
      }
    }
    else if (trimmed.startsWith('print(') || trimmed.includes('print(')) {
      output.push(`  LOAD    r${reg}, <arg>`)
      output.push(`  CALL    print, r${reg}`)
      reg++
    }
    else if (trimmed === '}') {
      output.push('  RET     void')
      output.push('')
    }
  }

  if (output.length <= 2) {
    output.push('.func main')
    for (const id of identifiers.slice(0, 3)) {
      output.push(`  LOAD    r${reg}, ${id}`)
      reg++
    }
    output.push('  RET     void')
  }

  return output.join('\n')
}

function buildFakeExecutable(source: string): string {
  const bytes: number[] = []
  // Magic header
  bytes.push(0x2B, 0x42, 0x00, 0x01)
  // Generate pseudo-deterministic bytes from source
  for (let i = 0; i < Math.min(source.length, 128); i++) {
    bytes.push((source.charCodeAt(i) * 7 + i * 13) & 0xFF)
  }
  // Pad to multiple of 16
  while (bytes.length % 16 !== 0) bytes.push(0x00)

  const lines: string[] = ['; 2b executable binary', '']
  for (let i = 0; i < bytes.length; i += 16) {
    const offset = i.toString(16).padStart(8, '0')
    const hex = bytes.slice(i, i + 16).map(b => b.toString(16).padStart(2, '0')).join(' ')
    const ascii = bytes.slice(i, i + 16).map(b => (b >= 32 && b < 127) ? String.fromCharCode(b) : '.').join('')
    lines.push(`${offset}  ${hex.padEnd(47)}  |${ascii}|`)
  }

  return lines.join('\n')
}

export function compile(source: string): CompileResult {
  return {
    ast: buildFakeAST(source),
    il: buildFakeIL(source),
    executable: buildFakeExecutable(source),
    errors: [],
  }
}
