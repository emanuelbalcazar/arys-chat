import Vue from 'vue'
import VueRouter from 'vue-router'
import { store } from '../store/index'

//import Auth from './auth.js'
import Home from '@/components/home/Home.vue'
import About from '@/components/about/About.vue'
import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'
import QRgenerator from '@/components/auth/QRgenerator.vue'

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
    //beforeEnter: Auth
  },
  {
    path: '/about',
    name: "About",
    component: About,
    //beforeEnter: Auth
  },
  {
    path: '/qr',
    name: "QRgenerator",
    component: QRgenerator//,
    //beforeEnter: Auth
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  console.log(store.getters.user)

  if (to.name == "Home" && !store.getters.user)
    router.push({ name: "Login" });

  if (to.name == "Home" && store.getters.user && !store.getters.isAuthenticated)
    router.push({ name: "QRgenerator" });

  if (to.name == "Login" && store.getters.user && store.getters.isAuthenticated)
    router.push({ name: "Home" });

  next();
})

export default router;
