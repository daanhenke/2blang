<template>
  <div class="min-h-screen flex flex-col font-sans bg-white text-gray-900">
    <SiteHeader />
    <div class="flex-1 flex w-full max-w-screen-2xl mx-auto">
      <Sidebar />
      <main class="flex-1 px-6 py-8 min-w-0">
        <slot />
      </main>
    </div>
    <SiteFooter />
  </div>
</template>
