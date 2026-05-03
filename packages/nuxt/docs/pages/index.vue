<script setup lang="ts">
import { useAsyncData, queryCollection } from '#imports'

const { data } = await useAsyncData('docs-index', () =>
  queryCollection('content').path('/').first()
)
</script>

<template>
  <Prose>
    <h1>Documentation</h1>
    <ContentRenderer
      v-if="data"
      :value="data"
    />
    <p v-else>
      Add markdown pages under <code>content/docs/</code>.
    </p>
  </Prose>
</template>
