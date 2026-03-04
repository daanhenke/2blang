<script setup lang="ts">
const route = useRoute()
const slugParts = Array.isArray(route.params.slug) ? route.params.slug : []
const path = slugParts.length > 0 ? `/${slugParts.join('/')}` : '/'

const { data: page } = await useAsyncData(`spec-${path}`, () =>
  queryCollection('spec').path(path).first(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useHead({
  title: page.value.title ? `${page.value.title} — 2b Spec` : '2b Language Specification',
})
</script>

<template>
  <div v-if="page">
    <h1>{{ page.title }}</h1>
    <ContentRenderer :value="page" />
  </div>
</template>
