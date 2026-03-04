<script setup lang="ts">
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <p class="app-footer__copyright">
        &copy; {{ new Date().getFullYear() }} 2b Language
      </p>
      <nav class="app-footer__links">
        <slot />
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  @apply border-t border-gray-200 bg-gray-50;
}

.app-footer__inner {
  @apply max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-500;
}

.app-footer__links {
  @apply flex items-center gap-4;
}

.app-footer__links :deep(a) {
  @apply hover:text-primary-600 transition-colors;
}
</style>
