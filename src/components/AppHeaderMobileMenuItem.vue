<template>
  <button
    class="-m-3 p-3 flex w-full items-center rounded-md text-gray-900 hover:text-gray-700"
    type="button"
  >
    <div v-if="props.icon">
      <dynamic-hero-icon
        v-if="isHeroIcon"
        :name="props.icon"
        class="rounded-full w-6 h-6 mr-4"
      />
      <dynamic-image-icon
        v-else
        :name="props.icon"
        class="rounded-full w-6 h-6 mr-4"
      />
    </div>
    <slot name="prepend" />
    <div class="text-left">
      <div class="text-base font-medium">
        {{ props.name }}
      </div>
    </div>
  </button>
</template>

<script setup>
import DynamicHeroIcon from "./DynamicHeroIcon.vue";
import DynamicImageIcon from "./DynamicImageIcon.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
    default: () => "",
  },
});

const isHeroIcon = props.icon.endsWith("Icon");
</script>
