import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path:'/allTask',
      component: () => import('../views/user/projectPlanning/allTask.vue')
    },
    {
      path:'/allProject',
      component: () => import('../views/user/projectPlanning/allProject.vue')
    },
    {
      path:'/allPerson',
      component: () => import('../views/user/projectPlanning/allPerson.vue')
    },
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
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/user/profile.vue')
    },
    {
      path: '/manager',
      name: 'managerHome',
      component: () => import('../views/manager/manager_home.vue')
    },
    {
      path: '/manager/userMessages',
      name: 'userMessages',
      component: () => import('../views/manager/user_messages.vue')
    },
    {
      path: '/manager/projectMessages',
      name: 'projectMessages',
      component: () => import('../views/manager/project_messages.vue')
    },
    {
      path: '/manager/loginMessages',
      name: 'loginMessages',
      component: () => import('../views/manager/user_login_messages.vue')
    },{
      path: '/hidden/corner',
      name: 'hidden corner',
      component: () => import('../views/dev/hidden_corner.vue')
    }
  ]
})



export default router
