<template>
  <button
    aria-expanded="false"
    class="h-8 text-gray-500 bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
    type="button"
  >
    <slot name="prepend" />
    <span class="text-base font-medium">
      {{ props.name }}
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});
</script>
