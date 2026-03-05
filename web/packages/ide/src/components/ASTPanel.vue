<script setup lang="ts">
import { useCompiler } from '../composables/useCompiler'
import ASTNode from './ASTNode.vue'

const { result } = useCompiler()
</script>

<template>
  <div class="ast-panel">
    <template v-if="result?.ast">
      <ASTNode :node="result.ast" />
    </template>
    <div v-else class="ast-empty">
      No AST available. Write some code and compile.
    </div>
  </div>
</template>

<style>
.ast-panel {
  height: 100%;
  overflow: auto;
  background: var(--ide-base, #1e1e2e);
  color: var(--ide-text, #cdd6f4);
  padding: 8px;
}

.ast-empty {
  color: var(--ide-overlay0, #6c7086);
  font-size: 13px;
  padding: 16px;
  text-align: center;
}
</style>
