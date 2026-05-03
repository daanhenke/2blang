import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts'
  },
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  banner: { js: '#!/usr/bin/env node' },
  external: [
    '@2blang/core',
    '@2blang/tooling',
    '@2blang/backend-wasm',
    '@2blang/backend-llvm'
  ]
})
