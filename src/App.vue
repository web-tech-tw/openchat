<template>
  <div class="relative bg-white">
    <app-header/>
    <router-view/>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from "@/components/General/AppHeader"
import AppFooter from "@/components/General/AppFooter"
export default {
  name: 'App',
  components: {AppHeader, AppFooter},
}
</script>
