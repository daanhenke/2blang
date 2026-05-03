<script setup lang="ts">
import { useAsyncData, queryCollection, useRoute } from '#imports'

definePageMeta({ layout: 'marketing' })

const route = useRoute()
const { data } = await useAsyncData(`website-${route.path}`, () =>
  queryCollection('content').path(route.path).first()
)
</script>

<template>
  <Prose>
    <ContentRenderer
      v-if="data"
      :value="data"
    />
    <p v-else>
      Not found.
    </p>
  </Prose>
</template>
