<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="address-page explorer-page page">
    <div class="address-body explorer-body">
      <div v-if="!loading && address" class="container">
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
          :all-txs="stakingTxs"
          with-shards="true"
          v-if="showStaking"
        >
          <slot>
            <TransactionTableTabs
              :value="showStaking"
              :onChange="value => (showStaking = value)"
            />
          </slot>
        </StakingTransactionsTable>
        <TransactionsTable :all-txs="allTxs" with-shards="true" v-else>
          <slot>
            <TransactionTableTabs
              :value="showStaking"
              :onChange="value => (showStaking = value)"
            />
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
      showStaking: false,
    };
  },
  computed: {
    txCount() {
      return this.allTxs.length;
    },
  },
  watch: {
    $route() {
      this.getAddress();
    },
  },
  mounted() {
    this.getAddress();
  },
  methods: {
    getAddress() {
      this.loading = true;
      let txs = {};
      let stakingTxs = {};

      const address = this.$route.params.address;

      service
        .getAddress(address)
        .then(address => {
          address.shardData.forEach(data => {
            data.txs.forEach(tx => {
              txs[tx.hash] = tx;
            });
          });

          address.shardData.forEach((data, idx) => {
            data.stakingTxs.forEach(tx => {
              stakingTxs[tx.hash] = {
                ...tx,
                shardID: idx,
                delegator: tx.msg.delegatorAddress,
                validator: tx.msg.validatorAddress,
                value: tx.msg.amount,
              };
            });
          });

          this.address = address;
        })
        .finally(() => {
          this.allTxs = Object.values(txs).sort((a, b) =>
            Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
          );

          this.stakingTxs = Object.values(stakingTxs).sort((a, b) =>
            Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
          );
          this.loading = false;
        });
    },
  },
};
</script>
