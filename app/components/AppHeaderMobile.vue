<template>
  <div
    class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50"
  >
    <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
      <div class="pt-5 pb-6 px-5">
        <div class="flex items-center justify-between" @click="emit('close')">
          <div>
            <h1 class="flex-auto text-lg font-semibold text-gray-900">
              {{ label }}
            </h1>
          </div>
          <div class="-mr-2">
            <button
              class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              type="button"
            >
              <span class="sr-only">Close menu</span>
              <UIcon name="i-heroicons-x-mark" class="h-6 w-6" />
            </button>
          </div>
        </div>
        <div class="mt-6">
          <nav class="grid gap-y-8">
            <div
              v-for="(item, index) in menuItems"
              :key="index"
            >
              <AppHeaderMenuItem
                :name="item.name"
                :icon="item.icon"
                variant="mobile"
                @click="onClickItem(item)"
              />
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject, type Ref} from "vue"

import {
  label,
  menuItems,
  type MenuFunctionItem,
} from "../data/AppHeaderMenuData"

const emit = defineEmits<{
  (e: 'close'): void
}>()

const parentMenuState = inject<Ref<boolean>>("parent-menu-state")!

const onClickItem = (item: MenuFunctionItem): void => {
  parentMenuState.value = false
  emit('close')
  item.onClick()
}
</script>
