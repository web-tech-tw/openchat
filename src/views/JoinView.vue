<template>
  <div class="my-9">
    <div class="my-3 text-xl text-center">OpenChat Hub 社群列表</div>
    <div class="container mb-2 flex mx-auto w-full items-center justify-center">
      <ul class="flex flex-col p-4">
        <li v-for="(i, j) in data" :key="j" class="border-gray-400 flex flex-row mb-2">
          <div class="rounded-md flex flex-1 items-center p-4 border-2 mt-3 border-sky-400">
            <div class="flex-1 pl-1 mr-16">
              <div class="font-medium">{{ i.name }}</div>
            </div>
            <router-link
                :to="`/join/${j}`"
                class="w-1/4 text-wrap text-center flex flex-col text-white text-bold rounded-md bg-sky-500 hover:bg-sky-700 justify-center items-center mr-10 p-2"
            >
              查看
            </router-link>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import data from "../assets/hub.json";

export default {
  name: "JoinView",
  data: () => ({data})
}
</script>
