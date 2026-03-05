<script setup lang="ts">
import { markRaw, onMounted, shallowRef } from 'vue'
import type { Project } from '@2b/ide'

definePageMeta({
  layout: false,
})

useHead({
  title: 'Explore 2b IDE',
})

const ideReady = shallowRef(false)
const IdeEditor = shallowRef<any>(null)

const project = shallowRef<Project>({
  id: 'explore',
  name: 'Explore 2b',
  files: [{
    name: 'main.2b',
    content: 'fn main() {\n  print("Hello from 2b Explore")\n}\n',
  }],
})

onMounted(async () => {
  const [mod] = await Promise.all([
    import('@2b/ide'),
    import('@2b/ide/src/editor/monaco-setup'),
    import('golden-layout/dist/css/goldenlayout-base.css'),
    import('golden-layout/dist/css/themes/goldenlayout-dark-theme.css'),
    import('@2b/ide/src/styles/golden-layout.css'),
  ])

  IdeEditor.value = markRaw(mod.IdeEditor)
  ideReady.value = true
})

function onProjectUpdate(nextProject: Project) {
  project.value = nextProject
}
</script>

<template>
  <div class="explore-page">
    <component
      :is="IdeEditor"
      v-if="ideReady"
      :project="project"
      class="explore-page__ide"
      @update:project="onProjectUpdate"
    />
    <div v-else class="explore-page__loading">
      Loading 2b IDE...
    </div>
  </div>
</template>

<style scoped>
.explore-page {
  width: 100vw;
  height: 100vh;
  background: var(--ide-crust, #11111b);
}

.explore-page__ide,
.explore-page__loading {
  width: 100%;
  height: 100%;
}

.explore-page__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ide-text, #cdd6f4);
}
</style>
