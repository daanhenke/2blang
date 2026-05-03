import { definePreset } from 'unocss'
import { presetWind4 } from '@unocss/preset-wind4'
import { presetIcons } from '@unocss/preset-icons'
import { presetTypography } from '@unocss/preset-typography'
import { presetWebFonts } from '@unocss/preset-web-fonts'

export interface Preset2blangOptions {
  /** Override or extend the brand color palette. */
  colors?: Record<string, string | Record<string, string>>
}

export const preset2blang = definePreset((options: Preset2blangOptions = {}) =>
{
  return {
    name: '@2blang/unocss-preset',
    presets: [
      presetWind4(),
      presetIcons({ scale: 1.2, warn: true }),
      presetTypography(),
      presetWebFonts({
        provider: 'bunny',
        fonts: {
          sans: 'Inter:400,500,600,700',
          mono: 'JetBrains Mono:400,500,600'
        }
      })
    ],
    theme: {
      colors: {
        brand: {
          50: '#f3f7ff',
          500: '#3a6df0',
          900: '#0d1b3d'
        },
        ...(options.colors ?? {})
      },
      fontFamily: {
        sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
        mono: '"JetBrains Mono", ui-monospace, monospace'
      }
    },
    shortcuts: {
      'btn': 'inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors',
      'btn-primary': 'btn bg-brand-500 text-white hover:bg-brand-900'
    }
  }
})

export default preset2blang
