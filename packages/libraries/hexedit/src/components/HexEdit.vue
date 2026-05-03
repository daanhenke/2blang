<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ bytes: Uint8Array }>()

const rows = computed(() =>
{
  const out: { offset: string, hex: string, ascii: string }[] = []
  for (let i = 0; i < props.bytes.length; i += 16)
  {
    const chunk = props.bytes.slice(i, i + 16)
    out.push({
      offset: i.toString(16).padStart(8, '0'),
      hex: Array.from(chunk, (b) => b.toString(16).padStart(2, '0')).join(' '),
      ascii: Array.from(chunk, (b) => (b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : '.')).join('')
    })
  }
  return out
})
</script>

<template>
  <pre class="font-mono text-xs leading-tight"><span
    v-for="row in rows"
    :key="row.offset"
  >{{ row.offset }}  {{ row.hex.padEnd(47) }}  {{ row.ascii }}
</span></pre>
</template>
