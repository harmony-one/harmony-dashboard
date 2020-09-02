import Vue from 'vue'
import Router from 'vue-router'
import DashboardPage from '@/components/DashboardPage'
import AdminPage from '@/components/AdminPage'
import BlocksPage from '@/components/BlocksPage'
import HomePage from '@/components/HomePage'
import BlockPage from '@/components/BlockPage'
import TransactionPage from '@/components/TransactionPage'
import TransactionsPage from '@/components/TransactionsPage'
import StakingTransactionsPage from '@/components/StakingTransactionsPage'
import Hrc20TransactionsPage from '@/components/Hrc20TransactionsPage'
import AddressPage from '@/components/AddressPage'
import ShardPage from '@/components/ShardPage'
import AddressShardPage from '@/components/AddressShardPage'
import TransactionsByBlockPage from '@/components/TransactionsByBlockPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/dashboard',
      name: 'DashboardPage',
      component: DashboardPage,
    },
    {
      path: '/admin',
      name: 'AdminPage',
      component: AdminPage,
    },
    {
      path: '/blocks/:pageIndex?',
      name: 'BlocksPage',
      component: BlocksPage,
    },
    {
      path: '/txs',
      name: 'TransactionsPage',
      component: TransactionsPage,
    },
    {
      path: '/staking-txs',
      name: 'StakingTransactionsPage',
      component: StakingTransactionsPage,
    },
    {
      path: '/hrc20-txs',
      name: 'Hrc20TransactionsPage',
      component: Hrc20TransactionsPage,
    },
    {
      path: '/block/:blockId',
      name: 'BlockPage',
      component: BlockPage,
    },
    {
      path: '/block/:blockId/txs',
      name: 'TransactionsByBlockPage',
      component: TransactionsByBlockPage,
    },
    {
      path: '/tx/:transactionId',
      name: 'TransactionPage',
      component: TransactionPage,
    },
    {
      path: '/staking-tx/:transactionId',
      name: 'TransactionPage',
      component: TransactionPage,
      props: { isStaking: true },
    },
    {
      path: '/address/:address',
      name: 'AddressPage',
      component: AddressPage,
    },
    {
      path: '/address/:address/shard/:shardId/:pageIndex?',
      name: 'AddressShardPage',
      component: AddressShardPage,
    },
    {
      path: '/shard/:id',
      name: 'ShardPage',
      component: ShardPage,
    },
  ],
})
