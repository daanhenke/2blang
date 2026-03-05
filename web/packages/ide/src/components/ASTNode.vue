<script setup lang="ts">
import { ref } from 'vue'
import type { ASTNode } from '../types/compiler'

const props = defineProps<{
  node: ASTNode
  depth?: number
}>()

const depth = props.depth ?? 0
const expanded = ref(depth < 3)
const hasChildren = (props.node.children?.length ?? 0) > 0

function toggle() {
  if (hasChildren) expanded.value = !expanded.value
}
</script>

<template>
  <div class="ast-node" :style="{ paddingLeft: `${depth * 16}px` }">
    <div class="ast-node-header" @click="toggle">
      <span v-if="hasChildren" class="ast-toggle">{{ expanded ? '▼' : '▶' }}</span>
      <span v-else class="ast-toggle-spacer" />
      <span class="ast-type">{{ node.type }}</span>
      <span v-if="node.value" class="ast-value">{{ node.value }}</span>
      <span v-if="node.line" class="ast-location">:{{ node.line }}</span>
    </div>
    <template v-if="expanded && node.children">
      <ASTNode
        v-for="(child, i) in node.children"
        :key="i"
        :node="child"
        :depth="depth + 1"
      />
    </template>
  </div>
</template>

<style>
.ast-node-header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  cursor: pointer;
  font-family: 'Cascadia Code', 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.ast-node-header:hover {
  background: var(--ide-surface0, #313244);
}

.ast-toggle {
  width: 14px;
  font-size: 10px;
  color: var(--ide-overlay1, #7f849c);
  flex-shrink: 0;
  text-align: center;
}

.ast-toggle-spacer {
  width: 14px;
  flex-shrink: 0;
}

.ast-type {
  color: var(--ide-token-type, #94e2d5);
  font-weight: 500;
}

.ast-value {
  color: var(--ide-token-value, #fab387);
}

.ast-value::before {
  content: '"';
  color: var(--ide-token-quote, #a6e3a1);
}

.ast-value::after {
  content: '"';
  color: var(--ide-token-quote, #a6e3a1);
}

.ast-location {
  color: var(--ide-overlay0, #6c7086);
  margin-left: auto;
}
</style>
