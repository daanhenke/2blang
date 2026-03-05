<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface MenuItem {
  label: string
  action?: () => void
  checked?: boolean
  disabled?: boolean
  separator?: boolean
  items?: MenuItem[]
}

export interface Menu {
  label: string
  items: MenuItem[]
}

defineProps<{
  menus: Menu[]
}>()

const openIndex = ref<number | null>(null)

function toggleMenu(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}

function onTopEnter(index: number) {
  if (openIndex.value !== null) {
    openIndex.value = index
  }
}

function closeAll() {
  openIndex.value = null
}

function handleAction(item: MenuItem) {
  if (item.disabled || item.items) return
  item.action?.()
  closeAll()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeAll()
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.main-menu')) closeAll()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('mousedown', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('mousedown', onClickOutside)
})
</script>

<template>
  <div class="main-menu">
    <div
      v-for="(menu, i) in menus"
      :key="menu.label"
      class="main-menu__top"
      :class="{ 'main-menu__top--open': openIndex === i }"
      @click="toggleMenu(i)"
      @mouseenter="onTopEnter(i)"
    >
      <span class="main-menu__top-label">{{ menu.label }}</span>

      <!-- Dropdown -->
      <div v-if="openIndex === i" class="main-menu__dropdown">
        <template v-for="item in menu.items" :key="item.label">
          <div v-if="item.separator" class="main-menu__separator" />
          <div
            v-else
            class="main-menu__item"
            :class="{
              'main-menu__item--disabled': item.disabled,
              'main-menu__item--has-submenu': !!item.items,
            }"
            @click.stop="handleAction(item)"
          >
            <span class="main-menu__check">{{ item.checked ? '✓' : '' }}</span>
            <span class="main-menu__item-label">{{ item.label }}</span>
            <span v-if="item.items" class="main-menu__arrow">►</span>

            <!-- Submenu -->
            <div v-if="item.items" class="main-menu__submenu">
              <template v-for="sub in item.items" :key="sub.label">
                <div v-if="sub.separator" class="main-menu__separator" />
                <div
                  v-else
                  class="main-menu__item"
                  :class="{
                    'main-menu__item--disabled': sub.disabled,
                    'main-menu__item--has-submenu': !!sub.items,
                  }"
                  @click.stop="handleAction(sub)"
                >
                  <span class="main-menu__check">{{ sub.checked ? '✓' : '' }}</span>
                  <span class="main-menu__item-label">{{ sub.label }}</span>
                  <span v-if="sub.items" class="main-menu__arrow">►</span>

                  <!-- Level 3 submenu -->
                  <div v-if="sub.items" class="main-menu__submenu">
                    <template v-for="sub2 in sub.items" :key="sub2.label">
                      <div v-if="sub2.separator" class="main-menu__separator" />
                      <div
                        v-else
                        class="main-menu__item"
                        :class="{ 'main-menu__item--disabled': sub2.disabled }"
                        @click.stop="handleAction(sub2)"
                      >
                        <span class="main-menu__check">{{ sub2.checked ? '✓' : '' }}</span>
                        <span class="main-menu__item-label">{{ sub2.label }}</span>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
.main-menu {
  display: flex;
  align-items: stretch;
  height: 100%;
}

.main-menu__top {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  color: var(--ide-subtext1, #bac2de);
  border-radius: 3px;
}

.main-menu__top:hover,
.main-menu__top--open {
  background: var(--ide-surface0, #313244);
  color: var(--ide-text, #cdd6f4);
}

.main-menu__top-label {
  white-space: nowrap;
}

.main-menu__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: var(--ide-surface0, #313244);
  border: 1px solid var(--ide-surface1, #45475a);
  border-radius: 4px;
  padding: 4px 0;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.main-menu__separator {
  height: 1px;
  background: var(--ide-surface1, #45475a);
  margin: 4px 8px;
}

.main-menu__item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 5px 12px;
  cursor: pointer;
  font-size: 13px;
  color: var(--ide-text, #cdd6f4);
  white-space: nowrap;
  gap: 4px;
}

.main-menu__item:hover {
  background: var(--ide-accent, #89b4fa);
  color: var(--ide-crust, #11111b);
}

.main-menu__item:hover > .main-menu__check,
.main-menu__item:hover > .main-menu__arrow {
  color: var(--ide-crust, #11111b);
}

.main-menu__item--disabled {
  opacity: 0.5;
  cursor: default;
}

.main-menu__item--disabled:hover {
  background: none;
  color: var(--ide-text, #cdd6f4);
}

.main-menu__check {
  width: 16px;
  text-align: center;
  font-size: 11px;
  flex-shrink: 0;
  color: var(--ide-accent, #89b4fa);
}

.main-menu__item-label {
  flex: 1;
}

.main-menu__arrow {
  font-size: 9px;
  margin-left: 12px;
  color: var(--ide-subtext0, #a6adc8);
  flex-shrink: 0;
}

/* Submenu positioning */
.main-menu__submenu {
  display: none;
  position: absolute;
  left: 100%;
  top: -4px;
  min-width: 180px;
  background: var(--ide-surface0, #313244);
  border: 1px solid var(--ide-surface1, #45475a);
  border-radius: 4px;
  padding: 4px 0;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.main-menu__item--has-submenu:hover > .main-menu__submenu {
  display: block;
}

/* Keep submenu item colors correct when parent is hovered */
.main-menu__submenu .main-menu__item {
  color: var(--ide-text, #cdd6f4);
}

.main-menu__submenu .main-menu__item .main-menu__check {
  color: var(--ide-accent, #89b4fa);
}

.main-menu__submenu .main-menu__item .main-menu__arrow {
  color: var(--ide-subtext0, #a6adc8);
}

.main-menu__submenu .main-menu__item:hover {
  background: var(--ide-accent, #89b4fa);
  color: var(--ide-crust, #11111b);
}

.main-menu__submenu .main-menu__item:hover > .main-menu__check,
.main-menu__submenu .main-menu__item:hover > .main-menu__arrow {
  color: var(--ide-crust, #11111b);
}
</style>
