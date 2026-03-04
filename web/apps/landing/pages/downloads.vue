<script setup lang="ts">
useHead({
  title: 'Downloads — 2b',
})
</script>

<template>
  <div class="downloads">
    <div class="downloads__inner">
      <h1 class="downloads__title">Downloads</h1>
      <p class="downloads__subtitle">
        Get the 2b compiler for your platform.
      </p>

      <div class="downloads__grid">
        <div class="downloads__card">
          <h3 class="downloads__card-title">Linux</h3>
          <p class="downloads__card-text">x86_64 / aarch64</p>
          <code class="downloads__card-cmd">curl -fsSL https://2blang.dev/install.sh | sh</code>
        </div>
        <div class="downloads__card">
          <h3 class="downloads__card-title">macOS</h3>
          <p class="downloads__card-text">Apple Silicon / Intel</p>
          <code class="downloads__card-cmd">brew install 2blang/tap/2b</code>
        </div>
        <div class="downloads__card">
          <h3 class="downloads__card-title">Windows</h3>
          <p class="downloads__card-text">x86_64</p>
          <code class="downloads__card-cmd">winget install 2blang.2b</code>
        </div>
      </div>

      <section class="downloads__source">
        <h2 class="downloads__source-title">Build from source</h2>
        <pre><code>git clone https://github.com/your-org/2blang.git
cd 2blang
cmake --preset native
cmake --build build/native</code></pre>
      </section>
    </div>
  </div>
</template>

<style scoped>
.downloads {
  @apply py-16;
}

.downloads__inner {
  @apply max-w-4xl mx-auto px-6;
}

.downloads__title {
  @apply text-3xl font-bold text-gray-900;
}

.downloads__subtitle {
  @apply mt-2 text-gray-600;
}

.downloads__grid {
  @apply mt-10 grid grid-cols-1 md:grid-cols-3 gap-6;
}

.downloads__card {
  @apply bg-white rounded-xl p-6 border border-gray-100 shadow-sm;
}

.downloads__card-title {
  @apply text-lg font-semibold text-gray-900 mb-1;
}

.downloads__card-text {
  @apply text-sm text-gray-500 mb-3;
}

.downloads__card-cmd {
  @apply block text-xs bg-gray-900 text-green-400 p-2 rounded font-mono;
}

.downloads__source {
  @apply mt-16;
}

.downloads__source-title {
  @apply text-xl font-semibold text-gray-900 mb-4;
}
</style>
