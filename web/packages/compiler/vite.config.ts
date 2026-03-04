import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: '2b'
    },
    rolldownOptions: {
      plugins: [
        {
          name: 'emit-wasm',
          generateBundle(options, bundle) {
            const wasmDir = path.resolve(__dirname, 'wasm')
            const files = [ '2bwasm.wasm' ]
            for (const file of files) {
              this.emitFile({
                type: 'asset',
                fileName: `wasm/${file}`,
                source: fs.readFileSync(path.join(wasmDir, file))
              })
            }
          }
        }
      ]
    }
  }
})
