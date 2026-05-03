<script setup lang="ts">
import { computed } from 'vue'
import { useAsyncData, queryCollection } from '#imports'

definePageMeta({ layout: 'singlepage' })

const { data } = await useAsyncData('spec-single', () =>
  queryCollection('content').order('path', 'ASC').all()
)

interface SpecDoc {
  path: string
  title?: string
  body?: unknown
}

const docs = computed<SpecDoc[]>(() => (data.value as SpecDoc[] | null) ?? [])

function slugFromPath(p: string): string
{
  return p.replace(/^\//, '').replace(/[/_]/g, '-') || 'top'
}

const tocLinks = computed(() =>
  docs.value.map((d) => ({
    id: slugFromPath(d.path),
    text: d.title ?? d.path,
    depth: 1
  }))
)
</script>

<template>
  <NuxtLayout
    name="singlepage"
    :toc-links="tocLinks"
  >
    <Prose>
      <h1>2blang specification</h1>
      <section
        v-for="doc in docs"
        :id="slugFromPath(doc.path)"
        :key="doc.path"
        class="mt-12 first:mt-0"
      >
        <ContentRenderer :value="doc" />
      </section>
      <p v-if="!docs.length">
        Add markdown chapters under <code>content/spec/</code>.
      </p>
    </Prose>
  </NuxtLayout>
</template>
