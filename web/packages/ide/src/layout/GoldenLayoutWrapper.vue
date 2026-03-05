<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, markRaw, type Component } from 'vue'
import { GoldenLayout, type LayoutConfig, type ComponentContainer, type JsonValue } from 'golden-layout'
import { defaultLayout } from './defaultLayout'

import FileTreePanel from '../components/FileTreePanel.vue'
import EditorPanel from '../components/EditorPanel.vue'
import ASTPanel from '../components/ASTPanel.vue'
import ILPanel from '../components/ILPanel.vue'
import OutputPanel from '../components/OutputPanel.vue'

const panelComponents: Record<string, Component> = {
  FileTree: markRaw(FileTreePanel),
  Editor: markRaw(EditorPanel),
  AST: markRaw(ASTPanel),
  IL: markRaw(ILPanel),
  Output: markRaw(OutputPanel),
}

interface ComponentInstance {
  id: number
  type: string
  element: HTMLElement
}

let instanceId = 0
const layoutRoot = ref<HTMLElement>()
const instances = shallowRef<ComponentInstance[]>([])
let goldenLayout: GoldenLayout | null = null

function createComponent(type: string, element: HTMLElement) {
  if (!(type in panelComponents)) {
    console.warn(`Unknown panel component: ${type}`)
    return
  }
  instances.value = [...instances.value, { id: ++instanceId, type, element }]
}

function destroyComponent(toRemove: HTMLElement) {
  instances.value = instances.value.filter(({ element }) => element !== toRemove)
}

onMounted(() => {
  if (!layoutRoot.value) return

  goldenLayout = new GoldenLayout(layoutRoot.value)

  goldenLayout.bindComponentEvent = (container: ComponentContainer, itemConfig: { componentType: JsonValue }) => {
    createComponent(itemConfig.componentType as string, container.element)
    return {
      component: undefined,
      virtual: false,
    }
  }

  goldenLayout.unbindComponentEvent = (container: ComponentContainer) => {
    destroyComponent(container.element)
  }

  goldenLayout.loadLayout(defaultLayout)
})

onBeforeUnmount(() => {
  goldenLayout?.destroy()
})
</script>

<template>
  <div ref="layoutRoot" class="gl-wrapper">
    <template v-for="inst in instances" :key="inst.id">
      <Teleport :to="inst.element">
        <component :is="panelComponents[inst.type]" />
      </Teleport>
    </template>
  </div>
</template>

<style>
.gl-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
