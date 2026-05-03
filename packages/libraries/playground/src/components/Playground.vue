<script setup lang="ts">
import { ref } from 'vue'
import { TextEdit } from '@2blang/textedit'
import { HexEdit } from '@2blang/hexedit'
import { emit as emitWasm } from '@2blang/backend-wasm'

const source = ref('// write some 2b here\n')
const output = ref<Uint8Array>(new Uint8Array(0))

function compile()
{
  output.value = emitWasm().bytes
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4 h-full">
    <div class="flex flex-col gap-2">
      <TextEdit
        v-model="source"
        language="2blang"
      />
      <button
        class="btn-primary self-start"
        @click="compile"
      >
        Compile
      </button>
    </div>
    <HexEdit :bytes="output" />
  </div>
</template>
