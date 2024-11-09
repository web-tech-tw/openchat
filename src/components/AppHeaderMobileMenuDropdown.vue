<template>
  <div class="relative">
    <button
      aria-expanded="false"
      class="text-gray-500 group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 w-full"
      type="button"
      @click="onClickDropdown"
    >
      <span>{{ props.name }}</span>
      <chevron-down-icon class="text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500" />
    </button>
    <div
      class="absolute z-10 -ml-7 mt-3 transform px-2 w-screen max-w-md sm:px-0 sm:-ml-4 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
    >
      <div
        v-show="isDropdownOpened"
        class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
      >
        <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
          <app-header-mobile-menu-dropdown-item
            v-for="(child, index) in props.children"
            :key="index"
            :name="child.name"
            :description="child.description"
            :icon="child.icon"
            @click="onClickItem(child)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch } from "vue";

import { ChevronDownIcon } from "@heroicons/vue/24/outline"

import AppHeaderMobileMenuDropdownItem from "./AppHeaderMobileMenuDropdownItem.vue";

const isDropdownOpened = ref(false);

const parentMenuState = inject("parent-menu-state");
watch(parentMenuState, (value) => {
  if (!value) {
    isDropdownOpened.value = false;
  }
});

const onClickDropdown = () => {
  isDropdownOpened.value = !isDropdownOpened.value;
  if (isDropdownOpened.value) {
    parentMenuState.value = true;
  }
};

const onClickItem = (item) => {
  parentMenuState.value = false;
  item.onClick();
}

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  children: {
    type: Array,
    required: true,
  }
});
</script>
