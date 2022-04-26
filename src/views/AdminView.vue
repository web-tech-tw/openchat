<template>
  <div class="text-center my-5">
    <div class="font-semibold text-xl text-slate-900">
      OpenChat 社群管理系統
    </div>
    <div class="flex justify-around my-5">
      <router-link to="/admin/room" class="bg-sky-500 hover:bg-sky-600 text-white rounded px-4 px-4 py-2 font-semibold">
        加入管理層社群
      </router-link>
      <router-link to="/admin/join" class="bg-sky-500 hover:bg-sky-600 text-white rounded px-4 px-4 py-2 font-semibold">
        檢查加入代碼
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminView"
}
</script>
