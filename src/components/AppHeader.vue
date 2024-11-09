<template>
  <div class="app-header">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <router-link to="/">
            <h1 class="flex-auto text-lg font-semibold text-gray-900 hidden sm:block">
              {{ title }}
            </h1>
            <p class="flex-auto text-md font-normal text-gray-500 hidden sm:block">
              {{ subtitle }}
            </p>
            <h1 class="flex-auto text-lg font-semibold text-gray-900 sm:hidden">
              {{ title }}
            </h1>
          </router-link>
        </div>
        <app-header-normal />
        <app-header-mobile-icon-button
          v-if="isMenuItemExist"
          class="-mr-2 -my-2 md:hidden"
          @click="onClickMobileMenuBtnOpen"
        >
          <bars4-icon class="h-6 w-6" />
        </app-header-mobile-icon-button>
      </div>
    </div>
    <app-header-mobile
      v-show="isMobileMenuOpened"
      @close="onClickMobileMenuBtnClose"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from "vue";

import { Bars4Icon } from "@heroicons/vue/24/outline"

import {
  title,
  subtitle,
  isSaraEnabled,
  menuItems,
} from "./AppHeaderMenuData.js";

import AppHeaderNormal from "./AppHeaderNormal.vue";
import AppHeaderMobile from "./AppHeaderMobile.vue";

import AppHeaderMobileIconButton from "./AppHeaderMobileIconButton.vue";

const isMobileMenuOpened = ref(false);

const parentMenuState = ref(true);
provide("parent-menu-state", parentMenuState);

const isMenuItemExist = isSaraEnabled || menuItems.length;

const onClickMobileMenuBtnOpen = () => {
  isMobileMenuOpened.value = true;
  parentMenuState.value = true;
}

const onClickMobileMenuBtnClose = () => {
  isMobileMenuOpened.value = false;
  parentMenuState.value = false;
}

const onDocumentClick = (e) => {
  if (!document.querySelector(".app-header").contains(e.target)) {
    parentMenuState.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick);
});
</script>
