import { defineNuxtPlugin } from '#imports'
import { usePdfMode } from '../composables/usePdfMode'

export default defineNuxtPlugin(() =>
{
  const pdf = usePdfMode()
  if (typeof document === 'undefined') return
  if (pdf.value) document.documentElement.dataset.pdfMode = 'true'
})
