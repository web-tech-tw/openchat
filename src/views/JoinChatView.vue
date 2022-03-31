<template>
  <div class="flex w-full justify-center backdrop-blur bg-sky-500">
    <div class="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20">
      <div class="flex justify-center md:justify-end -mt-16">
        <img :alt="info.name" class="w-20 h-20 object-cover rounded-full border-2 border-indigo-500" :src="icon">
      </div>
      <div>
        <h2 class="text-gray-800 text-3xl font-semibold">{{ info.name }}</h2>
        <p class="mt-2 text-gray-600">{{ info.description }}</p>
      </div>
      <div class="flex justify-end mt-4">
        <a class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" :href="info.url">加入社群</a>
      </div>
    </div>
  </div>
</template>

<script>
import data from "@/assets/hub.json";

export default {
  name: "JoinChatView",
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data: () => ({
    info: {
      name: null,
      description: null,
      url: null
    }
  }),
  computed: {
    icon() {
      if (!this.code) {
        return null;
      }
      return `${process.env.BASE_URL}static/images/chats/${this.code}.jpg`;
    }
  },
  created() {
    if (this.code in data) {
      this.info = data[this.code];
    } else {
      this.$router.replace({name: "join"});
    }
  }
}
</script>
