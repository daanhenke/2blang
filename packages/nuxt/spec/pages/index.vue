<script setup lang="ts">
import { computed } from 'vue'
import { useAsyncData, queryCollection, useRuntimeConfig } from '#imports'

const { data } = await useAsyncData('spec-toc', () =>
  queryCollection('content').order('path', 'ASC').all()
)

interface SpecDoc {
  path: string
  title?: string
}

const docs = computed<SpecDoc[]>(() => (data.value as SpecDoc[] | null) ?? [])
const config = useRuntimeConfig()
const baseURL = config.app.baseURL
</script>

<template>
  <Prose>
    <h1>2blang specification</h1>
    <p>
      Browse chapter-by-chapter, or read the
      <NuxtLink to="/single">
        entire specification on one page
      </NuxtLink>
      (also available as
      <a :href="`${baseURL}spec.pdf`">PDF</a>).
    </p>
    <ul>
      <li
        v-for="doc in docs"
        :key="doc.path"
      >
        <NuxtLink :to="doc.path">
          {{ doc.title ?? doc.path }}
        </NuxtLink>
      </li>
    </ul>
    <p v-if="!docs.length">
      Add markdown chapters under <code>content/spec/</code>.
    </p>
  </Prose>
</template>
