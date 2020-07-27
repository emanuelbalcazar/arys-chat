import { store } from '../store/index'

export default (to, from, next) => {
  if (store.getters.user && store.getters.isAuthenticated) {
    next()
  } else {
    next('/login')
  }
}