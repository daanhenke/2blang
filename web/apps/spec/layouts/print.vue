<template>
  <div class="print-layout">
    <slot />
  </div>
</template>

<style>
@media print {
  .print-layout {
    font-size: 11pt;
    line-height: 1.5;
    color: #000;
  }

  .print-layout h1 {
    page-break-before: always;
  }

  .print-layout h1:first-child {
    page-break-before: auto;
  }

  .print-layout pre {
    white-space: pre-wrap;
    border: 1px solid #ccc;
    background: #f8f8f8 !important;
    color: #333 !important;
  }

  .print-layout .ebnf-railroad svg {
    max-width: 100%;
    height: auto;
  }
}

@media screen {
  .print-layout {
    @apply max-w-4xl mx-auto px-8 py-12 prose prose-slate;
  }
}
</style>
