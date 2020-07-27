import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import { store } from './store';
import * as firebase from 'firebase'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyBhXa66H4AjmI1r_cfzEe3rFK3QVQ8v-Gw",
      authDomain: "arys-chat.firebaseapp.com",
      databaseURL: "https://arys-chat.firebaseio.com",
      projectId: "arys-chat",
      storageBucket: "arys-chat.appspot.com",
    })
  }
}).$mount('#app')
