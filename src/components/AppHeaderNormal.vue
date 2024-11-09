<template>
  <nav class="md:flex space-x-10 hidden">
    <div
      v-for="(item, index) in menuItems"
      :key="index"
    >
      <app-header-normal-menu-dropdown
        v-if="item.type === 'dropdown'"
        :name="item.name"
        :children="item.children"
      />
      <app-header-normal-menu-item
        v-else
        :name="item.name"
        @click="onClickItem(item)"
      />
    </div>
    <app-header-normal-menu-sara v-if="isSaraEnabled" />
  </nav>
</template>

<script setup>
import { inject } from "vue";

import AppHeaderNormalMenuItem from "./AppHeaderNormalMenuItem.vue"
import AppHeaderNormalMenuDropdown from "./AppHeaderNormalMenuDropdown.vue"
import AppHeaderNormalMenuSara from "./AppHeaderNormalMenuSara.vue"

import {
  isSaraEnabled,
  menuItems,
} from "./AppHeaderMenuData.js";

const parentMenuState = inject("parent-menu-state");

const onClickItem = (item) => {
  parentMenuState.value = false;
  item.onClick();
}
</script>
