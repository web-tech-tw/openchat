import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/rule",
    component: () => import("../views/RuleView.vue")
  },
  {
    path: "/join",
    component: () => import("../views/JoinView.vue")
  },
  {
    path: "/join/:code",
    component: () => import("../views/JoinChatView.vue")
  },
  {
    path: "/admin",
    component: () => import("../views/AdminView.vue")
  },
  {
    path: "/admin/join",
    component: () => import("../views/AdminJoinView.vue")
  },
  {
    path: "/admin/room",
    component: () => import("../views/AdminRoomView.vue")
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../views/NotFoundView.vue"),
  },
];

const router = createRouter({
  scrollBehavior: () => ({ top: 0 }),
  history: createWebHashHistory(),
  routes,
});

export default router;
