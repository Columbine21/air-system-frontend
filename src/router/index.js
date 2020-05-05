import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/home'
import Admin from '@/pages/admin/admin'
import Users from '@/pages/users/users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      name: 'Login',
      component: Home
    }, {
      path: '/admin',
      name: 'Admin',
      component: Admin
    }, {
      path: '/users',
      name: 'Users',
      component: Users
    }
  ]
})
