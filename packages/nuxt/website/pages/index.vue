<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig, useAsyncData, queryCollection } from '#imports'

interface DevSites {
  website?: string
  docs?: string
  spec?: string
}

definePageMeta({ layout: 'marketing' })

const app = useAppConfig()
const links = computed(() =>
{
  if (import.meta.dev)
  {
    const sites = (app.devSites ?? {}) as DevSites
    return { docs: sites.docs ?? '/docs/', spec: sites.spec ?? '/spec/' }
  }
  return { docs: '/docs/', spec: '/spec/' }
})

const { data } = await useAsyncData('website-index', () =>
  queryCollection('content').path('/').first()
)
</script>

<template>
  <section class="px-6 py-24 text-center max-w-4xl mx-auto">
    <h1 class="text-6xl font-bold tracking-tight">
      {{ app.brand.name }}
    </h1>
    <p class="text-xl text-gray-600 mt-6">
      {{ app.brand.tagline }}
    </p>
    <div class="mt-10 flex justify-center gap-3">
      <UiButton variant="primary">
        <a :href="links.docs">Read the docs</a>
      </UiButton>
      <UiButton>
        <a :href="links.spec">Spec</a>
      </UiButton>
    </div>
  </section>
  <section class="px-6 py-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
    <UiCard>
      <h2 class="text-lg font-semibold">
        Small surface
      </h2>
      <p class="text-sm text-gray-600 mt-2">
        A focused core with everything you need and nothing you don't.
      </p>
    </UiCard>
    <UiCard>
      <h2 class="text-lg font-semibold">
        Compiles anywhere
      </h2>
      <p class="text-sm text-gray-600 mt-2">
        WebAssembly and native via LLVM, from a single source language.
      </p>
    </UiCard>
    <UiCard>
      <h2 class="text-lg font-semibold">
        First-class tooling
      </h2>
      <p class="text-sm text-gray-600 mt-2">
        LSP, formatter, and an in-browser playground out of the box.
      </p>
    </UiCard>
  </section>
  <Prose v-if="data">
    <ContentRenderer :value="data" />
  </Prose>
</template>
