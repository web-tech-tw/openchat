<template>
  <img
    :alt="props.name"
    :src="cleanResource"
    v-bind="props"
  >
</template>

<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps<{
  name: string;
  class?: string;
}>();

type IconName = 'Unknown';

const allIcons: Record<IconName, string> = {Unknown: ''};
const resource = allIcons[props.name as IconName] || props.name;

const config = useRuntimeConfig();
const cleanResource = computed(() => {
  if (resource.startsWith('/')) {
    return `${config.app.baseURL}${resource.slice(1)}`;
  }
  return resource;
});
</script>
