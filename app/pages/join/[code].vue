<template>
  <div class="flex w-full justify-center bg-sky-500">
    <div class="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20">
      <div class="flex justify-center md:justify-end -mt-16">
        <img :alt="info.name" :src="icon" class="w-20 h-20 object-cover rounded-full border-2 border-white-500">
      </div>
      <div>
        <h2 class="text-gray-800 text-3xl font-semibold">{{ info.name }}</h2>
        <p v-show="!accept" class="mt-6 text-gray-600" v-html="description"></p>
        <p v-show="!accept" class="mt-6 text-amber-600">
          加入社群，即代表您同意遵守我們的
          <NuxtLink class="text-red-500" to="/rule">社群守則</NuxtLink>
          。
        </p>
        <p v-show="status" class="mt-2 text-red-600">{{ status }}</p>
        <p v-show="accept" class="mt-2 text-gray-600">
          請複製這份代碼，再貼上到OpenChat的審核答案內：
        </p>
        <div v-show="accept" class="w-full mt-2 text-gray-600 flex rounded bg-white shadow-md">
          <input :disabled="!ready"
                 :value="secret"
                 class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
                 type="text">
          <button :disabled="!ready" class="m-2 rounded px-4 py-2 font-semibold" @click="copySecret">
            <svg v-show="!ready" class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"></path>
            </svg>
            <svg v-show="ready" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div v-show="!accept" class="checkbox my-3">
        <div id="captcha" data-theme="light"></div>
      </div>
      <div class="flex justify-end mt-4">
        <button
            :disabled="!ready"
            class="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            @click="submit"
        >
          <svg v-show="!ready" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"></path>
          </svg>
          {{ state }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import data from '@/data/hub.json'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const api = useApi()

const code = computed(() => route.params.code as string)

const info = ref<{ name: string | null; description: string | null; url: string | null }>({
  name: null,
  description: null,
  url: null
})

const captcha = ref<string | null>(null)
const secret = ref<string | null>(null)
const status = ref<string | null>(null)
const accept = ref(false)
const ready = ref(true)

let turnstileScript: HTMLScriptElement | null = null

const icon = computed(() => {
  if (!code.value) return null
  return `/static/images/chats/${code.value}.jpg`
})

const description = computed(() => {
  return info.value.description?.replaceAll('\n', '<br />') || ''
})

const state = computed(() => {
  return !accept.value
    ? '加入社群'
    : ready.value
      ? '前往 LINE 社群'
      : '處理中...'
})

const copySecret = async () => {
  if (!ready.value || !secret.value) return
  try {
    await navigator.clipboard.writeText(secret.value)
    alert('已複製到剪貼簿')
  }
  catch (e) {
    console.error('Failed to copy:', e)
  }
}

const submit = async () => {
  if (!ready.value) return

  if (!accept.value) {
    if (!captcha.value) {
      status.value = '請完成驗證'
      return
    }

    accept.value = true
    ready.value = false
    status.value = ''

    const form = new URLSearchParams()
    form.set('slug', code.value)
    form.set('captcha', captcha.value)

    try {
      const response = await api?.post('applications', { body: form }).json<{ code: string }>()
      ready.value = true
      secret.value = response?.code || null
    }
    catch (e: any) {
      if (e?.response?.data?.code) {
        secret.value = e.response.data.code
      }
      else {
        status.value = '授權伺服器發生嚴重錯誤'
      }
    }
    finally {
      ready.value = true
    }
  }
  else {
    if (import.meta.client && info.value.url) {
      location.href = info.value.url
    }
  }
}

onMounted(() => {
  if (import.meta.client) {
    const turnstileScriptUrl = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=loadTurnstile'
    turnstileScript = document.createElement('script')
    turnstileScript.setAttribute('src', turnstileScriptUrl)
    
    window.loadTurnstile = () => {
      window.turnstile.render('#captcha', {
        sitekey: config.public.turnstileSiteKey,
        callback: (token: string) => {
          captcha.value = token
        },
      })
    }

    document.head.appendChild(turnstileScript)

    if (code.value in data) {
      info.value = data[code.value as keyof typeof data]
    }
    else {
      router.replace('/join')
    }
  }
})

onUnmounted(() => {
  if (import.meta.client && turnstileScript) {
    document.head.removeChild(turnstileScript)
  }
})
</script>
