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
                    Balance
                  </td>
                  <td>{{ address.balance | amount }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Transactions
                  </td>
                  <td>{{ txCount | number }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Staking Transactions
                  </td>
                  <td>{{ stakingTxCount | number }}</td>
                </tr>
              </table>
            </section>
          </div>
        </div>
        <div
          v-for="(shard, index) in address.shardData"
          :key="index"
          class="explorer-card"
        >
          <header>
            <h1>Shard {{ index }}</h1>
          </header>
          <div class="explorer-card-body">
            <section>
              <div v-if="shard.err" class="text-error">
                {{ shard.err }}
              </div>
              <table v-else class="explorer-table">
                <tr>
                  <td class="td-title">
                    Balance
                  </td>
                  <td>{{ shard.balance | amount }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Transactions
                  </td>
                  <td>{{ shard.txCount | number }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Staking transactions
                  </td>
                  <td>{{ shard.stakingTxCount | number }}</td>
                </tr>
              </table>
            </section>
          </div>
        </div>

        <StakingTransactionsTable
          v-if="showStaking"
          :loading="loading"
          :all-staking-txs="allStakingTxs"
          :tx-count="stakingTxCount"
          with-shards="true"
          :page="page"
          :changePage="changePage"
        >
          <slot>
            <TransactionTableTabs :value="showStaking" :on-change="changeTab" />
          </slot>
        </StakingTransactionsTable>
        <TransactionsTable
          v-else
          :loading="loading"
          :all-txs="allTxs"
          :tx-count="txCount"
          with-shards="true"
          :page="page"
          :changePage="changePage"
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
import service from '../explorer/service';
import LoadingMessage from './LoadingMessage';
import TransactionsTable from './TransactionsTable';
import StakingTransactionsTable from './StakingTransactionsTable';
import TransactionTableTabs from './TransactionTableTabs';

export default {
  name: 'AddressPage',
  components: {
    LoadingMessage,
    TransactionsTable,
    StakingTransactionsTable,
    TransactionTableTabs,
  },
  data() {
    return {
      loading: true,
      address: null,
      allTxs: [],
      allStakingTxs: [],
      txCount: 0,
      stakingTxCount: 0,
    };
  },
  computed: {
    showStaking() {
      return this.$route.query.txType === 'staking' ? true : false;
    },
    page() {
      return this.$route.query.page - 1 || 0;
    },
    showPanel() {
      return (
        !this.loading ||
        this.$route.params.address === (this.address && this.address.id)
      );
    },
  },
  watch: {
    $route() {
      if (this.$route.params.address !== (this.address && this.address.id)) {
        this.getAddress();
      }
    },
    page() {
      this.getAddress();
    },
  },
  mounted() {
    this.getAddress();
  },
  methods: {
    changeTab(value) {
      this.$router.replace({
        name: 'AddressPage',
        query: { txType: value ? 'staking' : 'regular' },
      });
    },
    changePage(value) {
      this.$router.replace({
        name: 'AddressPage',
        query: { page: value + 1, txType: this.$route.query.txType },
      });
    },
    getAddress() {
      this.loading = true;
      const txs = {};
      const stakingTxs = {};

      const address = this.$route.params.address;

      service
        .getAddress({ id: address, pageIndex: this.page, pageSize: 20 })
        .then(address => {
          address.shardData.forEach((data, idx) => {
            if (data.txs) {
              data.txs.forEach(tx => {
                txs[tx.hash] = {
                  ...tx,
                  shardID: idx,
                };
              });
            }
            if (data.stakingTxs) {
              data.stakingTxs.forEach(tx => {
                stakingTxs[tx.hash] = {
                  ...tx,
                  shardID: idx,
                  delegator: tx.msg.delegatorAddress,
                  validator: tx.msg.validatorAddress,
                  value: tx.msg.amount,
                };
              });
            }
          });

          this.txCount = address.txCount;
          this.stakingTxCount = address.stakingTxCount;

          this.address = address;
        })
        .finally(() => {
          this.allTxs = Object.values(txs).sort((a, b) =>
            Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
          );
          this.allStakingTxs = Object.values(stakingTxs).sort((a, b) =>
            Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
          );

          this.loading = false;
        });
    },
  },
};
</script>
