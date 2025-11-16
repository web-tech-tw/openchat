<template>
  <div class="flex justify-center mx-5 my-9">
    <ContentRenderer v-if="data" :value="data" class="max-w-[65ch] prose prose-sm md:prose-base" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'OpenChat Hub 規範',
})

const { data } = await useAsyncData('rule',
  () => queryCollection('content').path('/rule').first(),
)
</script>

