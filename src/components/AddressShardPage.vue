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
          :all-staking-txs="stakingTxs"
          with-shards="true"
        >
          <slot>
            <TransactionTableTabs
              :value="showStaking"
              :on-change="value => (showStaking = value)"
            />
          </slot>
        </StakingTransactionsTable>
        <TransactionsTable v-else :all-txs="allTxs" with-shards="true">
          <slot>
            <TransactionTableTabs
              :value="showStaking"
              :on-change="value => (showStaking = value)"
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

export default {
  name: 'AddressShardPage',
  components: {
    LoadingMessage,
  },
  data() {
    return {
      loading: true,
      address: null,
      shardId: -1,
      allTxs: null,
      allStakingTxs: [],
      showStaking: false,
    };
  },
  computed: {
    txCount() {
      return this.allTxs.length;
    },
    stakingTxCount() {
      return this.allStakingTxs.length;
    },
  },
  watch: {
    $route() {
      this.getAddressShard();
    },
  },
  mounted() {
    this.getAddressShard();
  },
  methods: {
    getAddressShard() {
      this.loading = true;

      const pageIndex = (+this.$route.params.pageIndex || 1) - 1;
      const address = this.$route.params.address;
      const shardId = this.$route.params.shardId;

      const txs = {};
      const stakingTxs = {};

      return service.getAddressShardSummary(address, shardId).then(address => {
        Promise.all([
          service.getAddressShardTxHistory(
            address,
            shardId,
            pageIndex,
            this.pageSize
          ),
          service.getAddressShardStakingTxHistory(
            address,
            shardId,
            0, // TODO: fix later
            this.pageSize
          ),
        ])
          .then(data => {
            // console.log(stringify(data, null, 2));
            if (data[0]) {
              data[0].forEach(tx => {
                txs[tx.hash] = tx;
              });
            }

            if (data[1]) {
              data[1].forEach(tx => {
                stakingTxs[tx.hash] = {
                  ...tx,
                  shardID: idx,
                  delegator: tx.msg.delegatorAddress,
                  validator: tx.msg.validatorAddress,
                  value: tx.msg.amount,
                };
              });
            }

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
      });
    },
  },
};
</script>
