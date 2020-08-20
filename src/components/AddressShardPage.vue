<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="address-page explorer-page page">
    <div class="address-body explorer-body">
      <div v-if="showPanel" class="container">
        <div class="explorer-card">
          <header>
            <h1>Address</h1>
          </header>

          <div class="explorer-card-body">
            <section>
              <table class="explorer-table">
                <tr>
                  <td class="td-title">
                    id
                  </td>
                  <td>{{ address.id }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Shard
                  </td>
                  <td>{{ $route.params.shardId }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Balance
                  </td>
                  <td>{{ address.balance | amount }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Transactions
                  </td>
                  <td>{{ address.txCount | number }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Staking transactions
                  </td>
                  <td>{{ address.stakingTxCount | number }}</td>
                </tr>
              </table>
            </section>
          </div>
        </div>

        <StakingTransactionsTable
          v-if="showStaking"
          :all-staking-txs="allStakingTxs"
          :tx-count="stakingTxCount"
          :loading="loading"
          with-shards="true"
          :page="page"
          :change-page="changePage"
        >
          <slot>
            <TransactionTableTabs :value="showStaking" :on-change="changeTab" />
          </slot>
        </StakingTransactionsTable>
        <TransactionsTable
          v-else
          :all-txs="allTxs"
          :tx-count="txCount"
          :loading="loading"
          with-shards="true"
          :page="page"
          :change-page="changePage"
        >
          <slot>
            <TransactionTableTabs :value="showStaking" :on-change="changeTab" />
          </slot>
        </TransactionsTable>
      </div>
      <div v-else class="container">
        <loading-message />
      </div>
    </div>
  </div>
</template>

<script>
import service from '../explorer/service'
import LoadingMessage from './LoadingMessage'
import TransactionsTable from './TransactionsTable'
import StakingTransactionsTable from './StakingTransactionsTable'
import TransactionTableTabs from './TransactionTableTabs'

export default {
  name: 'AddressShardPage',
  components: {
    LoadingMessage,
    StakingTransactionsTable,
    TransactionsTable,
    TransactionTableTabs,
  },
  data() {
    return {
      loading: true,
      address: null,
      shardId: -1,
      allTxs: [],
      allStakingTxs: [],
    }
  },
  computed: {
    showStaking() {
      return this.$route.query.txType === 'staking' ? true : false
    },
    page() {
      return this.$route.query.page - 1 || 0
    },
    showPanel() {
      return (
        !this.loading ||
        (this.$route.params.address === (this.address && this.address.id) &&
          this.$route.params.shardId === this.shardId)
      )
    },
  },
  watch: {
    $route() {
      if (
        this.$route.params.address !== (this.address && this.address.id) ||
        this.$route.params.shardId !== this.shardId
      ) {
        this.getAddressShard()
      }
    },
    page() {
      this.getAddressShard()
    },
  },
  mounted() {
    this.getAddressShard()
  },
  methods: {
    changeTab(value) {
      this.$router.replace({
        name: 'AddressShardPage',
        query: { txType: value ? 'staking' : 'regular' },
      })
    },
    changePage(value) {
      this.$router.replace({
        name: 'AddressShardPage',
        query: { page: value + 1, txType: this.$route.query.txType },
      })
    },
    getAddressShard() {
      this.loading = true

      const pageIndex = (+this.$route.params.pageIndex || 1) - 1
      const address = this.$route.params.address
      this.shardId = this.$route.params.shardId

      const txs = {}
      const stakingTxs = {}

      return service
        .getAddressShard({
          address,
          shardID: this.shardId,
          pageSize: 20,
          pageIndex,
        })
        .then(address => {
          if (address.txs) {
            address.txs.forEach(tx => {
              txs[tx.hash] = {
                ...tx,
                shardID: this.shardId,
              }
            })
          }
          if (address.stakingTxs) {
            address.stakingTxs.forEach(tx => {
              stakingTxs[tx.hash] = {
                ...tx,
                shardID: this.shardId,
                delegator: tx.msg.delegatorAddress,
                validator: tx.msg.validatorAddress,
                value: tx.msg.amount,
              }
            })
          }

          this.txCount = address.txCount
          this.stakingTxCount = address.stakingTxCount

          this.address = address
        })
        .finally(() => {
          this.allTxs = Object.values(txs).sort((a, b) =>
            Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
          )
          this.allStakingTxs = Object.values(stakingTxs).sort((a, b) =>
            Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
          )
          this.loading = false
        })
    },
  },
}
</script>
