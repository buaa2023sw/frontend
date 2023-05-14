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

import AllTask from "@/views/user/projectPlanning/allTask.vue"
import AllFile from "@/views/user/document/allFile.vue"

Vue.use(ElementUI, axios, VueAxios)
Vue.config.productionTip = false
Vue.component('AllTask', AllTask);
Vue.component('AllFile', AllFile);
new Vue({
  router,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')