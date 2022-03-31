import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/rule',
    name: 'rule',
    component: () => import('../views/RuleView.vue')
  },
  {
    path: '/join',
    name: 'join',
    component: () => import('../views/JoinView.vue')
  },
  {
    path: '/join/:code',
    name: 'join-chat',
    component: () => import('../views/JoinChatView.vue'),
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
