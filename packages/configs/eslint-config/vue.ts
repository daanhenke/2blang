import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tseslint from 'typescript-eslint'
import base from './index'

// Nuxt and `<script setup>` auto-imports — declared as readonly globals so
// `no-undef` doesn't trip. Anything Nuxt injects at compile time goes here;
// composables your own apps add via `imports.dirs` should also be added by
// each app's own config (or imported explicitly).
const nuxtGlobals = {
  // Vue / <script setup>
  defineProps: 'readonly',
  defineEmits: 'readonly',
  defineExpose: 'readonly',
  defineModel: 'readonly',
  defineSlots: 'readonly',
  defineOptions: 'readonly',
  withDefaults: 'readonly',
  // Nuxt config helpers
  defineNuxtConfig: 'readonly',
  defineAppConfig: 'readonly',
  defineNuxtModule: 'readonly',
  defineNuxtPlugin: 'readonly',
  definePageMeta: 'readonly',
  defineRouteRules: 'readonly',
  defineEventHandler: 'readonly',
  // Nuxt composables
  useNuxtApp: 'readonly',
  useRuntimeConfig: 'readonly',
  useAppConfig: 'readonly',
  useRoute: 'readonly',
  useRouter: 'readonly',
  useFetch: 'readonly',
  useAsyncData: 'readonly',
  useLazyFetch: 'readonly',
  useLazyAsyncData: 'readonly',
  useState: 'readonly',
  useHead: 'readonly',
  useSeoMeta: 'readonly',
  useCookie: 'readonly',
  useError: 'readonly',
  useRequestEvent: 'readonly',
  useRequestHeaders: 'readonly',
  navigateTo: 'readonly',
  abortNavigation: 'readonly',
  refreshCookie: 'readonly',
  refreshNuxtData: 'readonly',
  clearNuxtData: 'readonly',
  $fetch: 'readonly',
  // @nuxt/content
  queryCollection: 'readonly',
  queryCollectionNavigation: 'readonly',
  queryCollectionSearchSections: 'readonly'
} as const

export default tseslint.config(
  ...base,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2023,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      }
    }
  },
  {
    languageOptions: {
      globals: nuxtGlobals
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': [
        'error',
        { html: { void: 'always', normal: 'always', component: 'always' } }
      ]
    }
  }
)
