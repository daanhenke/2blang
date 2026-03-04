<script setup lang="ts">
definePageMeta({
  layout: 'print',
})

const { data: allPages } = await useAsyncData('spec-all', () =>
  queryCollection('spec').order('stem', 'ASC').all(),
)

useHead({
  title: '2b Language Specification',
})
</script>

<template>
  <div class="spec-print">
    <header class="spec-print__cover">
      <h1>2b Language Specification</h1>
      <p>Complete specification document</p>
    </header>

    <template v-if="allPages?.length">
      <article v-for="page in allPages" :key="page.id" class="spec-print__section">
        <h1>{{ page.title }}</h1>
        <ContentRenderer :value="page" />
      </article>
    </template>
  </div>
</template>

<style scoped>
.spec-print__cover {
  @apply text-center py-24;
}

.spec-print__cover h1 {
  @apply text-4xl font-bold;
}

.spec-print__cover p {
  @apply mt-4 text-lg text-gray-500;
}

.spec-print__section {
  @apply mb-16;
}

@media print {
  .spec-print__cover {
    page-break-after: always;
  }
}
</style>
