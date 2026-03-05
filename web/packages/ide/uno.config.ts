import { defineConfig, presetAttributify, presetUno } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      surface: {
        DEFAULT: '#1e1e1e',
        light: '#252526',
        lighter: '#2d2d30',
        border: '#3e3e42',
      },
      accent: {
        DEFAULT: '#0e639c',
        hover: '#1177bb',
      },
    },
  },
})
