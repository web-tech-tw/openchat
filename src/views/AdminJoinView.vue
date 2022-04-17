<template>
  <div class="flex w-full justify-center bg-sky-500">
    <div v-for="(i, j) in applications" :key="j" class="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20">
      <div>
        <h2 class="text-gray-800 text-3xl font-semibold">
          {{ i.code }}
        </h2>
        <p class="mt-2 text-gray-600">
          {{ i.user_agent }}
        </p>
        <p class="mt-2 text-gray-600">
          {{ i.ip_address }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminJoinView",
  data: () => ({
    applications: []
  }),
  computed: {
    authOptions() {
      return {headers: {Authorization: localStorage.getItem(process.env.VUE_APP_SARA_TOKEN_NAME)}}
    }
  },
  created() {
    this.$axios
        .get("applications", this.authOptions)
        .then((xhr) => this.applications.push(...xhr.data))
        .catch((error) => console.log(error));
  }
}
</script>
