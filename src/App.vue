<template>
  <div class="relative bg-white">
    <app-header />
    <router-view />
    <app-footer />
  </div>
</template>

<script setup>
import AppHeader from "./components/AppHeader.vue"
import AppFooter from "./components/AppFooter.vue"
</script>
