<template>
  <NuxtImg
    :src="props.name"
    :alt="props.name"
    class="rounded-full"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
}>()
</script>
