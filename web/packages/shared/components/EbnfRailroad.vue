<script setup lang="ts">
/**
 * Renders a single EBNF rule as an SVG railroad diagram.
 *
 * MDC usage:
 *   ::ebnf-railroad{file="grammar.ebnf" rule="expression"}
 */
const props = defineProps<{
  /** EBNF filename (relative to REPO_ROOT/assets/) */
  file: string
  /** Rule name to render */
  rule: string
}>()

const { data: svg, error } = await useAsyncData(
  `railroad-${props.file}-${props.rule}`,
  () => $fetch<string>(`/api/railroad`, {
    query: { file: props.file, rule: props.rule },
    responseType: 'text',
  }),
)
</script>

<template>
  <figure class="ebnf-railroad">
    <div v-if="svg" v-html="svg" />
    <!-- <div v-else-if="error" class="ebnf-railroad__error">
      Failed to render railroad diagram: {{ error.message }}
    </div> -->
    <figcaption>{{ rule }}</figcaption>
  </figure>
</template>

<style scoped>
.ebnf-railroad {
  @apply my-4 overflow-x-auto;
}

.ebnf-railroad__error {
  @apply text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3;
}
</style>
