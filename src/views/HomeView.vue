<template>
  <div>
    <div class="bg-gray-50 py-10 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span class="block mb-3">OpenChat Hub</span>
          <span class="block text-sky-600">我們在 LINE 與你相遇</span>
        </h2>
        <div class="mt-5 sm:mt-8 sm:flex lg:justify-start">
          <div class="mt-3 sm:mt-0 sm:ml-3">
            <router-link
                class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200 md:py-4 md:text-lg md:px-10"
                to="/join"
            >
              加入我們
            </router-link>
          </div>
        </div>
      </div>
      <p class="text-xl text-gray-500 max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
        由 臺灣網際網路技術推廣組織 所管理的 LINE社群。
      </p>
    </div>
    <div class="mt-10 mx-auto py-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
      <div class="sm:text-center lg:text-left">
        <h1 class="text-4xl tracking-tight font-extrabold text-gray-900">
          <span class="block xl:inline">務必遵守</span>
          <span class="block text-sky-600 xl:inline">社群規範</span>
        </h1>
        <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
          為了維護 OpenChat Hub 社群的安全及和平共處，我們制定了一系列社群規範，請務必遵守。
        </p>
        <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
          <div class="mt-3 sm:mt-0 sm:ml-3">
            <router-link
                class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200 md:py-4 md:text-lg md:px-10"
                to="/rule">
              閱讀社群規範
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
