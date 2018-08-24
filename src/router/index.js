import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import DashboardPage from '@/components/DashboardPage'

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
    }
  ]
})
