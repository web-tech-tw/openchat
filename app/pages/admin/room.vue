<template>
  <div class="flex flex-wrap w-full justify-center bg-sky-500 py-20">
    <div v-if="!ready" class="text-white">
      載入中...
    </div>
    <div v-else-if="!access" class="text-white">
      {{ status || "存取遭拒" }}
    </div>
    <div v-else>
      <div class="max-w-md mx-3 my-5 py-4 px-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-gray-800 text-3xl font-semibold">加入管理層社群</h2>
        <p class="mt-2 text-gray-600">你好，{{ profile?.nickname }}，這裡是加入密碼：</p>
        <p v-show="status" class="mt-2 text-red-600">{{ status }}</p>
        <div class="w-full mt-2 text-gray-600 flex rounded bg-white shadow-md">
          <input :value="password"
                 class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
                 type="text">
          <button class="m-2 rounded px-4 py-2 font-semibold" @click="copySecret">
            <svg v-show="ready" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="flex justify-end mt-4">
          <a
              :href="url"
              class="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            加入連結在這裡
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const api = useApi()

const profile = ref<any>(null)
const status = ref<string | null>(null)
const ready = ref(false)
const access = ref(false)
const url = ref<string | null>(null)
const password = ref<string | null>(null)

const copySecret = async () => {
  if (!navigator.clipboard) {
    status.value = '您的瀏覽器不支援複製功能'
    return
  }
  try {
    await navigator.clipboard.writeText(password.value || '')
    status.value = '已複製代碼'
  }
  catch {
    status.value = '無法複製代碼'
  }
}

onMounted(async () => {
  if (import.meta.client) {
    profile.value = useProfile()
    
    if (!profile.value) {
      const refer = `${config.public.selfHost}/#/admin/room`
      const redirectUrl = `${config.public.saraInteHost}/?refer=${encodeURIComponent(refer)}`
      location.assign(redirectUrl)
      return
    }

    if (
      Array.isArray(profile.value?.roles) &&
      profile.value.roles.includes('openchat')
    ) {
      access.value = true
    }
    else {
      console.warn('Forbidden')
      ready.value = true
      return
    }

    try {
      const response = await api?.get('admin-rooms').json<{ url: string; password: string }>()
      url.value = response?.url || null
      password.value = response?.password || null
    }
    catch (error) {
      status.value = '授權伺服器發生嚴重錯誤'
      console.error(error)
    }
    finally {
      ready.value = true
    }
  }
})
</script>
