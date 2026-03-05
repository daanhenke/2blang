export interface IdeTheme {
  id: string
  name: string
  monacoTheme: 'vs-dark' | 'vs' | 'hc-black'
  colors: {
    // Base surfaces
    base: string
    mantle: string
    crust: string
    surface0: string
    surface1: string
    surface2: string

    // Overlays
    overlay0: string
    overlay1: string
    overlay2: string

    // Text
    text: string
    subtext0: string
    subtext1: string

    // Accent
    accent: string
    accentHover: string

    // Semantic
    red: string
    green: string
    yellow: string
    blue: string
    mauve: string
    teal: string
    peach: string
    sky: string
    lavender: string

    // AST-specific tokens (map to language-like colors)
    tokenType: string
    tokenValue: string
    tokenQuote: string
  }
}

export const themes: IdeTheme[] = [
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    monacoTheme: 'vs-dark',
    colors: {
      base: '#1e1e2e',
      mantle: '#181825',
      crust: '#11111b',
      surface0: '#313244',
      surface1: '#45475a',
      surface2: '#585b70',
      overlay0: '#6c7086',
      overlay1: '#7f849c',
      overlay2: '#9399b2',
      text: '#cdd6f4',
      subtext0: '#a6adc8',
      subtext1: '#bac2de',
      accent: '#89b4fa',
      accentHover: '#b4befe',
      red: '#f38ba8',
      green: '#a6e3a1',
      yellow: '#f9e2af',
      blue: '#89b4fa',
      mauve: '#cba6f7',
      teal: '#94e2d5',
      peach: '#fab387',
      sky: '#89dceb',
      lavender: '#b4befe',
      tokenType: '#94e2d5',
      tokenValue: '#fab387',
      tokenQuote: '#a6e3a1',
    },
  },
  {
    id: 'catppuccin-macchiato',
    name: 'Catppuccin Macchiato',
    monacoTheme: 'vs-dark',
    colors: {
      base: '#24273a',
      mantle: '#1e2030',
      crust: '#181926',
      surface0: '#363a4f',
      surface1: '#494d64',
      surface2: '#5b6078',
      overlay0: '#6e738d',
      overlay1: '#8087a2',
      overlay2: '#939ab7',
      text: '#cad3f5',
      subtext0: '#a5adcb',
      subtext1: '#b8c0e0',
      accent: '#8aadf4',
      accentHover: '#b7bdf8',
      red: '#ed8796',
      green: '#a6da95',
      yellow: '#eed49f',
      blue: '#8aadf4',
      mauve: '#c6a0f6',
      teal: '#8bd5ca',
      peach: '#f5a97f',
      sky: '#91d7e3',
      lavender: '#b7bdf8',
      tokenType: '#8bd5ca',
      tokenValue: '#f5a97f',
      tokenQuote: '#a6da95',
    },
  },
  {
    id: 'catppuccin-frappe',
    name: 'Catppuccin Frappe',
    monacoTheme: 'vs-dark',
    colors: {
      base: '#303446',
      mantle: '#292c3c',
      crust: '#232634',
      surface0: '#414559',
      surface1: '#51576d',
      surface2: '#626880',
      overlay0: '#737994',
      overlay1: '#838ba7',
      overlay2: '#949cbb',
      text: '#c6d0f5',
      subtext0: '#a5adce',
      subtext1: '#b5bfe2',
      accent: '#8caaee',
      accentHover: '#babbf1',
      red: '#e78284',
      green: '#a6d189',
      yellow: '#e5c890',
      blue: '#8caaee',
      mauve: '#ca9ee6',
      teal: '#81c8be',
      peach: '#ef9f76',
      sky: '#99d1db',
      lavender: '#babbf1',
      tokenType: '#81c8be',
      tokenValue: '#ef9f76',
      tokenQuote: '#a6d189',
    },
  },
  {
    id: 'catppuccin-latte',
    name: 'Catppuccin Latte',
    monacoTheme: 'vs',
    colors: {
      base: '#eff1f5',
      mantle: '#e6e9ef',
      crust: '#dce0e8',
      surface0: '#ccd0da',
      surface1: '#bcc0cc',
      surface2: '#acb0be',
      overlay0: '#9ca0b0',
      overlay1: '#8c8fa1',
      overlay2: '#7c7f93',
      text: '#4c4f69',
      subtext0: '#6c6f85',
      subtext1: '#5c5f77',
      accent: '#1e66f5',
      accentHover: '#7287fd',
      red: '#d20f39',
      green: '#40a02b',
      yellow: '#df8e1d',
      blue: '#1e66f5',
      mauve: '#8839ef',
      teal: '#179299',
      peach: '#fe640b',
      sky: '#04a5e5',
      lavender: '#7287fd',
      tokenType: '#179299',
      tokenValue: '#fe640b',
      tokenQuote: '#40a02b',
    },
  },
  {
    id: 'one-dark',
    name: 'One Dark',
    monacoTheme: 'vs-dark',
    colors: {
      base: '#282c34',
      mantle: '#21252b',
      crust: '#1b1f27',
      surface0: '#2c313a',
      surface1: '#353b45',
      surface2: '#3e4451',
      overlay0: '#545862',
      overlay1: '#636870',
      overlay2: '#767b83',
      text: '#abb2bf',
      subtext0: '#828997',
      subtext1: '#979eab',
      accent: '#61afef',
      accentHover: '#82c4f8',
      red: '#e06c75',
      green: '#98c379',
      yellow: '#e5c07b',
      blue: '#61afef',
      mauve: '#c678dd',
      teal: '#56b6c2',
      peach: '#d19a66',
      sky: '#56b6c2',
      lavender: '#c678dd',
      tokenType: '#56b6c2',
      tokenValue: '#d19a66',
      tokenQuote: '#98c379',
    },
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    monacoTheme: 'vs-dark',
    colors: {
      base: '#0d1117',
      mantle: '#010409',
      crust: '#010409',
      surface0: '#161b22',
      surface1: '#21262d',
      surface2: '#30363d',
      overlay0: '#484f58',
      overlay1: '#6e7681',
      overlay2: '#8b949e',
      text: '#e6edf3',
      subtext0: '#8b949e',
      subtext1: '#b1bac4',
      accent: '#58a6ff',
      accentHover: '#79c0ff',
      red: '#f85149',
      green: '#3fb950',
      yellow: '#d29922',
      blue: '#58a6ff',
      mauve: '#bc8cff',
      teal: '#39d353',
      peach: '#d29922',
      sky: '#79c0ff',
      lavender: '#bc8cff',
      tokenType: '#7ee787',
      tokenValue: '#a5d6ff',
      tokenQuote: '#3fb950',
    },
  },
]

export function getThemeById(id: string): IdeTheme {
  return themes.find(t => t.id === id) || themes[0]!
}

export function monacoThemeName(theme: IdeTheme): string {
  return `ide-${theme.id}`
}

export function defineMonacoTheme(monaco: typeof import('monaco-editor'), theme: IdeTheme) {
  const c = theme.colors
  const isDark = theme.monacoTheme !== 'vs'

  monaco.editor.defineTheme(monacoThemeName(theme), {
    base: theme.monacoTheme,
    inherit: true,
    rules: [
      { token: '', foreground: c.text.slice(1) },
      { token: 'comment', foreground: c.overlay1.slice(1), fontStyle: 'italic' },
      { token: 'keyword', foreground: c.mauve.slice(1) },
      { token: 'keyword.control', foreground: c.mauve.slice(1) },
      { token: 'string', foreground: c.green.slice(1) },
      { token: 'number', foreground: c.peach.slice(1) },
      { token: 'type', foreground: c.yellow.slice(1) },
      { token: 'type.identifier', foreground: c.yellow.slice(1) },
      { token: 'function', foreground: c.blue.slice(1) },
      { token: 'variable', foreground: c.text.slice(1) },
      { token: 'operator', foreground: c.sky.slice(1) },
      { token: 'delimiter', foreground: c.overlay2.slice(1) },
      { token: 'delimiter.bracket', foreground: c.overlay2.slice(1) },
      { token: 'tag', foreground: c.blue.slice(1) },
      { token: 'attribute.name', foreground: c.yellow.slice(1) },
      { token: 'attribute.value', foreground: c.green.slice(1) },
    ],
    colors: {
      'editor.background': c.base,
      'editor.foreground': c.text,
      'editor.lineHighlightBackground': isDark ? c.surface0 + '80' : c.surface0 + '60',
      'editor.selectionBackground': c.accent + '40',
      'editor.inactiveSelectionBackground': c.accent + '20',
      'editorLineNumber.foreground': c.overlay0,
      'editorLineNumber.activeForeground': c.lavender,
      'editorCursor.foreground': c.lavender,
      'editorWhitespace.foreground': c.surface2,
      'editorIndentGuide.background': c.surface1,
      'editorIndentGuide.activeBackground': c.surface2,
      'editor.selectionHighlightBackground': c.accent + '20',
      'editor.wordHighlightBackground': c.accent + '20',
      'editorBracketMatch.background': c.accent + '30',
      'editorBracketMatch.border': c.accent,
      'editorGutter.background': c.base,
      'editorWidget.background': c.mantle,
      'editorWidget.border': c.surface1,
      'editorSuggestWidget.background': c.mantle,
      'editorSuggestWidget.border': c.surface1,
      'editorSuggestWidget.selectedBackground': c.surface0,
      'editorHoverWidget.background': c.mantle,
      'editorHoverWidget.border': c.surface1,
      'input.background': c.surface0,
      'input.border': c.surface1,
      'input.foreground': c.text,
      'focusBorder': c.accent,
      'scrollbarSlider.background': c.surface1 + '80',
      'scrollbarSlider.hoverBackground': c.surface2 + '80',
      'scrollbarSlider.activeBackground': c.overlay0 + '80',
    },
  })
}

export function registerAllMonacoThemes(monaco: typeof import('monaco-editor')) {
  for (const theme of themes) {
    defineMonacoTheme(monaco, theme)
  }
}

export function applyTheme(theme: IdeTheme, root: HTMLElement) {
  const c = theme.colors
  root.style.setProperty('--ide-base', c.base)
  root.style.setProperty('--ide-mantle', c.mantle)
  root.style.setProperty('--ide-crust', c.crust)
  root.style.setProperty('--ide-surface0', c.surface0)
  root.style.setProperty('--ide-surface1', c.surface1)
  root.style.setProperty('--ide-surface2', c.surface2)
  root.style.setProperty('--ide-overlay0', c.overlay0)
  root.style.setProperty('--ide-overlay1', c.overlay1)
  root.style.setProperty('--ide-overlay2', c.overlay2)
  root.style.setProperty('--ide-text', c.text)
  root.style.setProperty('--ide-subtext0', c.subtext0)
  root.style.setProperty('--ide-subtext1', c.subtext1)
  root.style.setProperty('--ide-accent', c.accent)
  root.style.setProperty('--ide-accent-hover', c.accentHover)
  root.style.setProperty('--ide-red', c.red)
  root.style.setProperty('--ide-green', c.green)
  root.style.setProperty('--ide-yellow', c.yellow)
  root.style.setProperty('--ide-blue', c.blue)
  root.style.setProperty('--ide-mauve', c.mauve)
  root.style.setProperty('--ide-teal', c.teal)
  root.style.setProperty('--ide-peach', c.peach)
  root.style.setProperty('--ide-sky', c.sky)
  root.style.setProperty('--ide-lavender', c.lavender)
  root.style.setProperty('--ide-token-type', c.tokenType)
  root.style.setProperty('--ide-token-value', c.tokenValue)
  root.style.setProperty('--ide-token-quote', c.tokenQuote)
}
