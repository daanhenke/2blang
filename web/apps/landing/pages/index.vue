<script setup lang="ts">
const { public: { currentVersion, sitePrefix } } = useRuntimeConfig()

useHead({
  title: '2b — A Programming Language',
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="hero__inner">
        <h1 class="hero__title">
          The <span class="hero__highlight">2b</span> Programming Language
        </h1>
        <p class="hero__subtitle">
          A modern programming language designed for clarity and performance.
        </p>
        <div class="hero__actions">
          <NuxtLink to="/downloads" class="hero__btn hero__btn--primary">
            Download
          </NuxtLink>
          <a :href="`${sitePrefix}/docs/${currentVersion}/`" class="hero__btn hero__btn--secondary">
            Documentation
          </a>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="features__inner">
        <div class="features__card">
          <h3 class="features__card-title">Fast</h3>
          <p class="features__card-text">
            Compiles to native code and WebAssembly for maximum performance.
          </p>
        </div>
        <div class="features__card">
          <h3 class="features__card-title">Safe</h3>
          <p class="features__card-text">
            Strong type system catches errors at compile time.
          </p>
        </div>
        <div class="features__card">
          <h3 class="features__card-title">Expressive</h3>
          <p class="features__card-text">
            Clean syntax that's easy to read and write.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  @apply bg-gradient-to-br from-primary-50 to-blue-50 py-24;
}

.hero__inner {
  @apply max-w-4xl mx-auto px-6 text-center;
}

.hero__title {
  @apply text-5xl font-extrabold tracking-tight text-gray-900;
}

.hero__highlight {
  @apply text-primary-600;
}

.hero__subtitle {
  @apply mt-4 text-xl text-gray-600;
}

.hero__actions {
  @apply mt-8 flex items-center justify-center gap-4;
}

.hero__btn {
  @apply px-6 py-2.5 rounded-lg font-medium text-sm transition-colors;
}

.hero__btn--primary {
  @apply bg-primary-600 text-white hover:bg-primary-700;
}

.hero__btn--secondary {
  @apply bg-white text-primary-700 border border-primary-200 hover:bg-primary-50;
}

.features {
  @apply py-20;
}

.features__inner {
  @apply max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8;
}

.features__card {
  @apply bg-white rounded-xl p-6 border border-gray-100 shadow-sm;
}

.features__card-title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.features__card-text {
  @apply text-sm text-gray-600 leading-relaxed;
}
</style>
