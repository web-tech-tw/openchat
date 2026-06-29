<template>
  <div class="min-h-[70vh] bg-gradient-to-b from-sky-50 via-slate-50 to-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-4xl bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 transition-all duration-500">
      <!-- Title & Header -->
      <div class="text-center max-w-2xl mx-auto mb-10">
        <span class="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold bg-sky-100 text-sky-800 mb-4 tracking-wide uppercase">
          <UIcon name="i-heroicons-cog-6-tooth" class="h-3.5 w-3.5 animate-spin" style="animation-duration: 8s;" />
          管理員專區
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
          OpenChat 社群管理系統
        </h1>
        <p class="mt-3 text-base sm:text-lg text-slate-500">
          歡迎使用管理後台，請選擇您要執行的管理操作
        </p>
      </div>

      <!-- Actions Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <!-- Card 1: Join Admin Room -->
        <NuxtLink
          to="/admin/room"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          <div>
            <!-- Icon -->
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-all duration-300 group-hover:bg-sky-500 group-hover:text-white mb-5 shadow-sm">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="h-6 w-6" />
            </div>
            <!-- Title -->
            <h3 class="text-xl font-bold text-slate-800 transition-colors duration-300 group-hover:text-sky-600">
              加入管理層社群
            </h3>
            <!-- Description -->
            <p class="mt-2 text-sm text-slate-500 leading-relaxed">
              獲取管理團隊專屬 LINE 社群的加入連結與驗證密碼，與其他社群協同管理者進行即時溝通。
            </p>
          </div>
          <!-- Arrow Indicator -->
          <div class="mt-6 flex items-center text-sm font-semibold text-sky-600 group-hover:text-sky-700">
            立即前往
            <UIcon name="i-heroicons-arrow-right" class="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </NuxtLink>

        <!-- Card 2: Check Join Code -->
        <NuxtLink
          to="/admin/join"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div>
            <!-- Icon -->
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white mb-5 shadow-sm">
              <UIcon name="i-heroicons-shield-check" class="h-6 w-6" />
            </div>
            <!-- Title -->
            <h3 class="text-xl font-bold text-slate-800 transition-colors duration-300 group-hover:text-indigo-600">
              檢查加入代碼
            </h3>
            <!-- Description -->
            <p class="mt-2 text-sm text-slate-500 leading-relaxed">
              輸入並驗證申請人提供的審核驗證碼，查閱其地理位置、裝置與歷史紀錄以確認是否放行。
            </p>
          </div>
          <!-- Arrow Indicator -->
          <div class="mt-6 flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
            開始檢查
            <UIcon name="i-heroicons-arrow-right" class="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
