import { useSiteContext } from './useSiteContext'

/**
 * Returns a reactive boolean indicating whether the current build is being
 * rendered for PDF export. Components should branch on this to pick a
 * print-friendly variant — no interactive overlays, no sticky headers, no
 * lazy images, simpler typography.
 *
 * The value is set at build time via `NUXT_PUBLIC_2BLANG_PDF_MODE=1` and
 * mirrored to a `data-pdf-mode` attribute on `<html>` so plain CSS can also
 * react to it.
 */
export function usePdfMode()
{
  return useSiteContext().pdfMode
}
