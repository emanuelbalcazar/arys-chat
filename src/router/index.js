import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home.vue'
import About from '@/components/about/About.vue'
import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: { name: 'Login' },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
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
