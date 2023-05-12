import Vue from 'vue'

import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios"
import VueAxios from 'vue-axios'

import './assets/main.css'
import vuetify from './plugins/vuetify'
import '@babel/polyfill'

// import allTask from "@/views/user/projectPlanning/allTask"

Vue.use(ElementUI, axios, VueAxios)

new Vue({
  router,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
// Vue.component('allTask', allTask);