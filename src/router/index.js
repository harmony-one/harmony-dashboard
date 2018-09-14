import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import DashboardPage from '@/components/DashboardPage'
import AdminPage from '@/components/AdminPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/dashboard',
      name: 'DashboardPage',
      component: DashboardPage
    },
    {
      path: '/admin',
      name: 'AdminPage',
      component: AdminPage
    }
  ]
})
