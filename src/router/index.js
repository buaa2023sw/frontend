import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { requireLogin: true }
    }, {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { requireLogin: false }
    }, {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    }, {
      path: '/dev/:projid',
      name: 'dev',
      component: () => import('../views/Dev.vue')

    }

  ]
})



export default router
