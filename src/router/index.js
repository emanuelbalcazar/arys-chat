import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home.vue'
import About from '@/components/about/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: "About",
    component: About
  }
]

const router = new VueRouter({
  routes
})

export default router;
