<template>
  <div class="relative bg-white">
    <app-header/>
    <router-view/>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from "@/components/General/AppHeader"
import AppFooter from "@/components/General/AppFooter"
export default {
  name: 'App',
  components: {AppHeader, AppFooter},
  data: () => ({
    menu: [
      {
        name: "Social Media",
        type: "dropdown",
        status: false,
        items: [
          {
            name: "Discord",
            description: "歡迎加入",
            icon: "/static/images/brands/discord.svg",
            action: () => location.assign("https://discord.gg/xpyuq342nX")
          },
          {
            name: "LINE OpenChat",
            description: "歡迎加入",
            icon: "/static/images/brands/line.svg",
            action: () => location.assign("https://web-tech-tw.github.io/openchat")
          }
        ]
      },
      {
        name: "GitHub",
        type: "function",
        icon: "/static/images/brands/github.svg",
        action: () => location.assign("https://github.com/web-tech-tw")
      }
    ],
    mobile_menu: {
      status: false
    },
  })
}
</script>