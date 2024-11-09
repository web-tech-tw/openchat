<template>
  <img
    :alt="props.name"
    :src="resource"
    v-bind="props"
  >
</template>

<script setup>
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

const allIcons = {};
const resource = allIcons[props.name];
</script>