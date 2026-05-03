<script setup lang="ts">
import { useAsyncData, queryCollection, useRoute } from '#imports'

const route = useRoute()
const { data } = await useAsyncData(`spec-${route.path}`, () =>
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
