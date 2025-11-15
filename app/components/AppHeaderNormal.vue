<template>
  <nav class="md:flex space-x-10 hidden">
    <div
      v-for="(item, index) in menuItems"
      :key="index"
    >
      <AppHeaderMenuItem
        :name="item.name"
        :icon="item.icon"
        variant="normal"
        @click="onClickItem(item)"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import {inject, type Ref} from "vue"

import {
  menuItems,
  type MenuFunctionItem,
} from "../data/AppHeaderMenuData"

const parentMenuState = inject<Ref<boolean>>("parent-menu-state")!

const onClickItem = (item: MenuFunctionItem): void => {
  parentMenuState.value = false
  item.onClick()
}
</script>
