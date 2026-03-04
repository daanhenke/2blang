<template>
  <div>
    <h3>Counter: {{ count }}</h3>
    <button @click="increment">
      Increment
    </button>
    <button @click="decrement">
      Decrement
    </button>
  </div>
</template>

<script setup lang="ts">
const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}

// @ts-ignore
import versioningData from 'virtual:git-versioning'
onMounted(() => {
  console.log('Versioning data:', versioningData)
})
</script>

<style scoped>
button {
  margin: 5px;
}
</style>
