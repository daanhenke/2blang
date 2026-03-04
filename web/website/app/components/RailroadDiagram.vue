<script setup lang="ts">
const props = defineProps<{
  file: string
  rule: string
}>()

const { data } = await useFetch<{ svg: string }>('/api/railroad', {
  query: { file: props.file, rule: props.rule },
})
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-if="data" class="railroad-diagram" v-html="data.svg" />
</template>

<style>
.railroad-diagram svg.railroad-diagram {
  display: block;
  margin: 1em 0;
  background-color: hsl(30, 20%, 95%);
}

.railroad-diagram svg.railroad-diagram path {
  stroke-width: 3;
  stroke: black;
  fill: rgba(0, 0, 0, 0);
}

.railroad-diagram svg.railroad-diagram text {
  font: bold 14px monospace;
  text-anchor: middle;
}

.railroad-diagram svg.railroad-diagram text.label {
  text-anchor: start;
}

.railroad-diagram svg.railroad-diagram text.comment {
  font: italic 12px monospace;
}

.railroad-diagram svg.railroad-diagram rect {
  stroke-width: 3;
  stroke: black;
  fill: hsl(120, 100%, 90%);
}
</style>
