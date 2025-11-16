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
        <h2 class="text-gray-800 text-3xl font-semibold">檢查加入代碼</h2>
        <p class="mt-2 text-gray-600">請輸入申請人的加入代碼：</p>
        <div class="w-full mt-2 text-gray-600 flex rounded bg-white shadow-md">
          <input v-model="query"
                 class="w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
                 placeholder="例如：000000" type="text" @keydown.enter="submit">
          <button class="m-2 rounded px-4 py-2 font-semibold" @click="submit">
            <svg class="mt-1 h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <p v-show="status" class="mt-2 text-red-600">{{ status }}</p>
      </div>
      <div v-if="application.code" class="max-w-md mx-3 my-5 py-4 px-8 bg-white shadow-lg rounded-lg">
        <h2 class="text-gray-800 text-3xl font-semibold mb-3">
          加入代碼：{{ application.code }}
        </h2>
        <p class="mt-2 text-gray-600">
          <ul class="mb-3">
            <li>申請時間：{{ dateParsedCreatedAt }}</li>
          </ul>
          <ul class="mb-3">
            <li>IP 位址：{{ application.ipAddress }}</li>
            <li>IP 地理資訊：
              <ul class="pl-3">
                <li>國家：{{ application.ipGeolocation?.country }}</li>
                <li>城市：{{ application.ipGeolocation?.city }}</li>
                <li>時區：{{ application.ipGeolocation?.timezone }}</li>
              </ul>
            </li>
          </ul>
          <ul class="mb-3">
            <li>使用者裝置資訊：
              <ul class="pl-3">
                <li>作業系統：
                  <ul class="pl-3">
                    <li>名稱：{{ uaParsed.os?.name }}</li>
                    <li>版本：{{ uaParsed.os?.version }}</li>
                  </ul>
                </li>
                <li>瀏覽器：
                  <ul class="pl-3">
                    <li>名稱：{{ uaParsed.browser?.name }}</li>
                    <li>版本：{{ uaParsed.browser?.version }}</li>
                    <li>使用者代理：
                      <p class="pl-3">
                        <code>{{ uaParsed.ua }}</code>
                      </p>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </p>
        <div v-if="!application.commitBy" class="flex justify-end mt-4">
          <button
              class="flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-1 rounded-full"
              @click="approval">
            許可
          </button>
          <button
              class="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-1 rounded-full"
              @click="reject">
            否決
          </button>
        </div>
        <p v-else class="mt-2 text-amber-600">
          已由 {{ commitBy }} 於 {{ dateParsedCommitAt }} 簽署 {{ application.commitState ? '許可' : '否決' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import uaParser from 'ua-parser-js'
import dayjs from 'dayjs'

const config = useRuntimeConfig()
const api = useApi()

const access = ref(false)
const ready = ref(false)
const query = ref<string | null>(null)
const status = ref<string | null>(null)
const commitBy = ref<string | null>(null)
const application = ref<any>({})
const profile = ref<any>(null)

const humanReadableFormater = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const getUserNickname = async (userId: string) => {
  try {
    const response = await $fetch<any>(`https://web-tech.tw/recv/sara/users/${userId}`)
    return response?.profile?.nickname || userId
  }
  catch {
    return userId
  }
}

const submit = async () => {
  status.value = ''
  if (!query.value) {
    status.value = '請輸入資料'
    return
  }

  try {
    const response = await api?.get('applications', {
      searchParams: { code: query.value }
    }).json()
    application.value = response
    const { commitBy: commitByValue } = application.value
    if (commitByValue) {
      commitBy.value = await getUserNickname(commitByValue)
      return
    }
    status.value = ''
  }
  catch (e: any) {
    application.value = {}
    if (e?.response?.status !== 404) {
      status.value = '發生嚴重錯誤'
      return
    }
    status.value = '加入代碼不存在'
  }
}

const approval = async () => {
  try {
    await api?.patch('applications', {
      searchParams: {
        code: query.value,
        state: 'true',
      }
    })
    await submit()
  }
  catch (e) {
    console.error(e)
  }
}

const reject = async () => {
  try {
    await api?.patch('applications', {
      searchParams: {
        code: query.value,
        state: 'false',
      }
    })
    application.value = {}
  }
  catch (e) {
    console.error(e)
  }
}

const uaParsed = computed(() => {
  const { userAgent: uaString } = application.value
  return uaParser(uaString)
})

const dateParsedCreatedAt = computed(() => {
  const { createdAt } = application.value
  return humanReadableFormater(createdAt)
})

const dateParsedCommitAt = computed(() => {
  const { commitAt } = application.value
  return humanReadableFormater(commitAt)
})

onMounted(() => {
  if (import.meta.client) {
    profile.value = useProfile()

    if (!profile.value) {
      const refer = `${config.public.selfHost}/#/admin/join`
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
    }
    ready.value = true
  }
})
</script>
