import { defineNuxtPlugin, useHead } from '#imports'
import { usePdfMode } from '../composables/usePdfMode'

export default defineNuxtPlugin(() =>
{
  const pdf = usePdfMode()
  useHead({
    htmlAttrs: pdf.value ? { 'data-pdf-mode': 'true' } : {}
  })
})
