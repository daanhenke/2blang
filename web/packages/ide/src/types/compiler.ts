export interface ASTNode {
  type: string
  value?: string
  children?: ASTNode[]
  line?: number
  column?: number
}

export interface CompileError {
  line: number
  column: number
  message: string
  severity: 'error' | 'warning'
}

export interface CompileResult {
  ast: ASTNode
  il: string
  executable: string
  errors: CompileError[]
}
