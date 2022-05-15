<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <router-link to="/">
            <h1 class="flex-auto text-lg font-semibold text-gray-900">
              OpenChat Hub
            </h1>
          </router-link>
        </div>
        <nav class="md:flex space-x-10 hidden">
          <div v-for="(item, index) in menu" :key="index">
            <button
                v-if="item.type === 'function'"
                aria-expanded="false"
                class="text-base font-medium text-gray-500 hover:text-gray-900"
                type="button"
                @click="item.action"
            >
              {{ item.name }}
            </button>
          </div>
        </nav>
        <div class="-mr-2 -my-2 md:hidden">
          <button
              aria-expanded="false"
              class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
              type="button"
              @click="menu_collapse.mobile_menu = true"
          >
            <span class="sr-only">Open menu</span>
            <svg aria-hidden="true" class="h-6 w-6" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-show="menu_collapse.mobile_menu"
         class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
      <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
        <div class="pt-5 pb-6 px-5">
          <div class="flex items-center justify-between" @click="menu_collapse.mobile_menu = false">
            <div>
              <h1 class="flex-auto text-lg font-semibold text-gray-900 sm:hidden">
                OpenChat Hub
              </h1>
            </div>
            <div class="-mr-2">
              <button
                  class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                  type="button">
                <span class="sr-only">Close menu</span>
                <svg aria-hidden="true" class="h-6 w-6" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-6">
            <nav class="grid gap-y-8">
              <div v-for="(item, index) in menu" :key="index">
                <button
                    v-if="item.type === 'function'"
                    class="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50 w-full"
                    type="button"
                    @click="item.action"
                >
                  <img :alt="item.name" :src="item.icon" class="rounded-full" height="30" width="30">
                  <span class="ml-3 text-base font-medium text-gray-900">{{ item.name }}</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  data: () => ({
    menu_collapse: {
      mobile_menu: false
    },
  }),
  computed: {
    menu() {
      return [
        {
          name: "社群列表",
          type: "function",
          icon: require("@/assets/images/icons/collection.svg"),
          action: () => {
            this.$router.push({name: "join"})
            this.menu_collapse.mobile_menu = false
          }
        },
        {
          name: "社群規範",
          type: "function",
          icon: require("@/assets/images/icons/information-circle.svg"),
          action: () => {
            this.$router.push({name: "rule"})
            this.menu_collapse.mobile_menu = false
          }
        },
        {
          name: "社群管理",
          type: "function",
          icon: require("@/assets/images/icons/shield-check.svg"),
          action: () => {
            this.$router.push({name: "admin"})
            this.menu_collapse.mobile_menu = false
          }
        },
        {
          name: "回首頁",
          type: "function",
          icon: require("@/assets/images/icons/home.svg"),
          action: () => location.assign("https://web-tech-tw.github.io")
        }
      ]
    },
  }
}
</script>
