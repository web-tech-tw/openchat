<template>
  <div class="app-header relative z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
        <!-- Logo / Title -->
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <nuxt-link to="/">
            <h1 class="flex-auto text-lg font-semibold text-gray-900 hidden sm:block">
              {{ title }}
            </h1>
            <p class="flex-auto text-md font-normal text-gray-500 hidden sm:block">
              {{ subtitle }}
            </p>
            <h1 class="flex-auto text-lg font-semibold text-gray-900 sm:hidden">
              {{ label }}
            </h1>
          </nuxt-link>
        </div>

        <!-- Desktop Navigation (Normal) -->
        <nav class="md:flex space-x-10 hidden">
          <div
            v-for="(item, index) in menuItems"
            :key="index"
            class="relative"
          >
            <!-- Dropdown Menu -->
            <template v-if="item.type === 'dropdown'">
              <button
                aria-expanded="false"
                class="h-8 text-gray-500 group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                type="button"
                @click="toggleDropdown(item.name)"
              >
                <span>{{ item.name }}</span>
                <UIcon name="i-heroicons-chevron-down" class="text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500" />
              </button>
              <div class="absolute z-10 mt-3 transform px-2 w-screen max-w-md sm:px-0 -ml-4 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                <div
                  v-show="activeDropdown === item.name"
                  class="rounded-lg shadow-lg overflow-hidden"
                >
                  <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                    <button
                      v-for="(child, childIndex) in item.children"
                      :key="childIndex"
                      class="-m-3 p-3 flex w-full items-center rounded-md text-gray-900 hover:text-gray-700 cursor-pointer"
                      type="button"
                      @click="onClickDropdownItem(child)"
                    >
                      <div v-if="child.icon">
                        <dynamic-hero-icon
                          v-if="child.icon.endsWith('Icon')"
                          :name="child.icon"
                          class="rounded-full w-6 h-6 mr-4"
                        />
                        <dynamic-image-icon
                          v-else
                          :name="child.icon"
                          class="rounded-full w-6 h-6 mr-4"
                        />
                      </div>
                      <div class="text-left">
                        <div class="text-base font-medium">
                          {{ child.name }}
                        </div>
                        <div class="mt-1 text-sm text-gray-500">
                          {{ child.description }}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- Function Menu Item -->
            <template v-else>
              <button
                class="h-8 text-gray-500 bg-white inline-flex text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center rounded-md hover:text-gray-700 cursor-pointer"
                type="button"
                @click="onClickItem(item)"
              >
                <div class="text-left">
                  <div class="text-base font-medium">
                    {{ item.name }}
                  </div>
                </div>
              </button>
            </template>
          </div>

          <!-- Sara Profile / Login Button (Desktop) -->
          <template v-if="isSaraEnabled">
            <!-- If profile === null (Login) -->
            <button
              v-if="profile === null"
              class="h-8 text-gray-500 bg-white inline-flex text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center rounded-md hover:text-gray-700 cursor-pointer"
              type="button"
              @click="onClickSaraBtn"
            >
              <div class="text-left">
                <div class="text-base font-medium">
                  登入
                </div>
              </div>
            </button>
            <!-- If profile !== null (Nickname / Avatar) -->
            <button
              v-else
              class="h-8 text-gray-500 bg-white inline-flex text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center rounded-md hover:text-gray-700 cursor-pointer"
              type="button"
              @click="onClickSaraBtn"
            >
              <img
                :src="identicon"
                :alt="nickname"
                class="rounded-full w-8 h-8 mr-2"
              >
              <div class="text-left">
                <div class="text-base font-medium">
                  {{ nickname }}
                </div>
              </div>
            </button>
          </template>
        </nav>

        <!-- Mobile Menu Hamburger Button -->
        <button
          v-if="isMenuItemExist"
          class="-mr-2 -my-2 md:hidden bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 cursor-pointer"
          type="button"
          aria-expanded="false"
          @click="onClickMobileMenuBtnOpen"
        >
          <span class="sr-only">Open menu</span>
          <UIcon name="i-heroicons-bars-4" class="h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Overlay Menu -->
    <div
      v-show="isMobileMenuOpened"
      class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
    >
      <div class="rounded-lg shadow-lg bg-white divide-y-2 divide-gray-50">
        <div class="pt-5 pb-6 px-5">
          <!-- Mobile Drawer Header -->
          <div
            class="flex items-center justify-between"
            @click="onClickMobileMenuBtnClose"
          >
            <div>
              <h1 class="flex-auto text-lg font-semibold text-gray-900 sm:hidden">
                {{ label }}
              </h1>
            </div>
            <div class="-mr-2">
              <button
                class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 cursor-pointer"
                type="button"
              >
                <span class="sr-only">Close menu</span>
                <UIcon name="i-heroicons-x-mark" class="h-6 w-6" />
              </button>
            </div>
          </div>

          <!-- Mobile Drawer Navigation Items -->
          <div class="mt-6">
            <nav class="grid gap-y-8">
              <div
                v-for="(item, index) in menuItems"
                :key="index"
                class="relative"
              >
                <!-- Dropdown Menu (Mobile) -->
                <template v-if="item.type === 'dropdown'">
                  <button
                    aria-expanded="false"
                    class="text-gray-500 group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer w-full"
                    type="button"
                    @click="toggleDropdown(item.name)"
                  >
                    <span>{{ item.name }}</span>
                    <UIcon name="i-heroicons-chevron-down" class="text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500" />
                  </button>
                  <div class="absolute z-10 mt-3 transform px-2 w-screen max-w-md sm:px-0 -ml-7 sm:-ml-4 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                    <div
                      v-show="activeDropdown === item.name"
                      class="rounded-lg shadow-lg overflow-hidden"
                    >
                      <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                        <button
                          v-for="(child, childIndex) in item.children"
                          :key="childIndex"
                          class="-m-3 p-3 flex w-full items-center rounded-md text-gray-900 hover:text-gray-700 cursor-pointer"
                          type="button"
                          @click="onClickDropdownItem(child)"
                        >
                          <div v-if="child.icon">
                            <dynamic-hero-icon
                              v-if="child.icon.endsWith('Icon')"
                              :name="child.icon"
                              class="rounded-full w-6 h-6 mr-4"
                            />
                            <dynamic-image-icon
                              v-else
                              :name="child.icon"
                              class="rounded-full w-6 h-6 mr-4"
                            />
                          </div>
                          <div class="text-left">
                            <div class="text-base font-medium">
                              {{ child.name }}
                            </div>
                            <div class="mt-1 text-sm text-gray-500">
                              {{ child.description }}
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Function Menu Item (Mobile) -->
                <template v-else>
                  <button
                    class="text-gray-900 -m-3 p-3 w-full flex items-center rounded-md hover:text-gray-700 cursor-pointer"
                    type="button"
                    @click="onClickItem(item)"
                  >
                    <div v-if="item.icon">
                      <dynamic-hero-icon
                        v-if="item.icon.endsWith('Icon')"
                        :name="item.icon"
                        class="rounded-full w-6 h-6 mr-4"
                      />
                      <dynamic-image-icon
                        v-else
                        :name="item.icon"
                        class="rounded-full w-6 h-6 mr-4"
                      />
                    </div>
                    <div class="text-left">
                      <div class="text-base font-medium">
                        {{ item.name }}
                      </div>
                    </div>
                  </button>
                </template>
              </div>

              <!-- Sara Profile / Login Button (Mobile) -->
              <template v-if="isSaraEnabled">
                <!-- If profile === null (Login with icon) -->
                <button
                  v-if="profile === null"
                  class="text-gray-900 -m-3 p-3 w-full flex items-center rounded-md hover:text-gray-700 cursor-pointer"
                  type="button"
                  @click="onClickSaraBtn"
                >
                  <div>
                    <dynamic-hero-icon
                      name="ArrowRightOnRectangleIcon"
                      class="rounded-full w-6 h-6 mr-4"
                    />
                  </div>
                  <div class="text-left">
                    <div class="text-base font-medium">
                      登入
                    </div>
                  </div>
                </button>
                <!-- If profile !== null (Nickname with avatar) -->
                <button
                  v-else
                  class="text-gray-900 -m-3 p-3 w-full flex items-center rounded-md hover:text-gray-700 cursor-pointer"
                  type="button"
                  @click="onClickSaraBtn"
                >
                  <img
                    :src="identicon"
                    :alt="nickname"
                    class="rounded-full w-6 h-6 mr-4"
                  >
                  <div class="text-left">
                    <div class="text-base font-medium">
                      {{ nickname }}
                    </div>
                  </div>
                </button>
              </template>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, computed} from 'vue';

import {
  title,
  subtitle,
  label,
  isSaraEnabled,
  menuItems,
  onClickSara,
  type MenuFunctionItem,
  type MenuDropdownChild,
} from '../data/AppHeaderMenuData';

const isMobileMenuOpened = ref(false);
const activeDropdown = ref<string | null>(null);

const isMenuItemExist = isSaraEnabled || menuItems.length;

const profile = useProfile();

const nickname = computed(() => {
  if (!profile) return '';
  return profile.nickname;
});

const identicon = computed(() => {
  if (!profile) return '';
  const {avatar_hash: avatarHash} = profile;
  return `https://api.gravatar.com/avatar/${avatarHash}?d=identicon`;
});

const toggleDropdown = (name: string) => {
  if (activeDropdown.value === name) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = name;
  }
};

const onClickMobileMenuBtnOpen = (): void => {
  isMobileMenuOpened.value = true;
};

const onClickMobileMenuBtnClose = (): void => {
  isMobileMenuOpened.value = false;
};

const onClickItem = (item: MenuFunctionItem): void => {
  isMobileMenuOpened.value = false;
  activeDropdown.value = null;
  item.onClick();
};

const onClickDropdownItem = (item: MenuDropdownChild): void => {
  isMobileMenuOpened.value = false;
  activeDropdown.value = null;
  item.onClick();
};

const onClickSaraBtn = (): void => {
  isMobileMenuOpened.value = false;
  activeDropdown.value = null;
  onClickSara(profile);
};

const onDocumentClick = (e: MouseEvent): void => {
  const target = e.target as HTMLElement;
  if (!document.querySelector('.app-header')?.contains(target)) {
    isMobileMenuOpened.value = false;
    activeDropdown.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick);
});
</script>
