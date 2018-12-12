import Vue from 'vue'
import Router from 'vue-router'
import DashboardPage from '@/components/DashboardPage'
import AdminPage from '@/components/AdminPage'
import BlocksPage from '@/components/BlocksPage'
import BlockPage from '@/components/BlockPage'
import TransactionPage from '@/components/TransactionPage'
import AddressPage from '@/components/AddressPage'

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
      path: '/blocks',
      name: 'BlocksPage',
      component: BlocksPage
    },
    {
      path: '/block/:blockId',
      name: 'BlockPage',
      component: BlockPage
    },
    {
      path: '/tx/:transactionId',
      name: 'TransactionPage',
      component: TransactionPage
    },
    {
      path: '/address/:address',
      name: 'AddressPage',
      component: AddressPage
    }
  ]
})
