<template>
  <component
    :is="resource"
    v-bind="props"
  />
</template>

<script setup>
import * as allIcons from "@heroicons/vue/24/outline";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: false,
    default: () => ""
  },
});

const resource = allIcons[props.name];
</script>