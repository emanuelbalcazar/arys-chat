import Vue from 'vue'
import VueRouter from 'vue-router'
import { store } from '../store/index'

import Home from '@/components/home/Home.vue'
import About from '@/components/about/About.vue'
import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import QRgenerator from '@/components/auth/QRgenerator.vue'
import ChatList from '@/components/chats/ChatList.vue'
import Chat from '@/components/chats/Chat.vue'

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
    component: Home,
  },
  {
    path: '/about',
    name: "About",
    component: About,
  },
  {
    path: '/qr',
    name: "QRgenerator",
    component: QRgenerator
  },
  {
    path: '/chats',
    name: "ChatList",
    component: ChatList
  },
  {
    path: '/chats/:id',
    name: 'Chat',
    component: Chat,
    props: true,
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
});

// check if user is authenticated
router.beforeEach((to, from, next) => {

  if (to.name == "Login" || to.name == "QRgenerator" && store.getters.isAuthenticated) {
    return next({name: "ChatList"});
  }

  if (to.name != "Login" && to.name != "Register" && !store.getters.isAuthenticated) {
    return next({name: "Login"})
  } 

  next();
})

export default router;
