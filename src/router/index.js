import Vue from 'vue'
import Router from 'vue-router'
import DashboardPage from '@/components/DashboardPage'
import AdminPage from '@/components/AdminPage'
import ExplorerPage from '@/components/ExplorerPage'
import BlocksPage from '@/components/BlocksPage'
import BlockPage from '@/components/BlockPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DashboardPage',
      component: DashboardPage
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
    },
    {
      path: '/explorer',
      name: 'ExplorerPage',
      component: ExplorerPage
    },
    {
      path: '/blocks',
      name: 'BlocksPage',
      component: BlocksPage
    },
    {
      path: '/block/:blockId',
      name: 'BlockPage',
      component: BlockPage
    }
  ]
})
