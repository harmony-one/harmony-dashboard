import Vue from 'vue'
import Router from 'vue-router'
import DashboardPage from '@/components/DashboardPage'
import AdminPage from '@/components/AdminPage'
import BlocksPage from '@/components/BlocksPage'
import HomePage from '@/components/HomePage'
import BlockPage from '@/components/BlockPage'
import TransactionPage from '@/components/TransactionPage'
import TransactionsPage from '@/components/TransactionsPage'
import AddressPage from '@/components/AddressPage'
import ShardPage from '@/components/ShardPage'

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
    },
    {
      path: '/blocks/:pageIndex?',
      name: 'BlocksPage',
      component: BlocksPage
    },
    {
      path: '/txs/:pageIndex?',
      name: 'TransactionsPage',
      component: TransactionsPage
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
    },
    {
      path: '/shard/:id',
      name: 'ShardPage',
      component: ShardPage
    }
  ]
})
