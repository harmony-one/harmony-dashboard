<style scoped lang="less">
@import "../less/common.less";
</style>

<template>
  <div class="address-page explorer-page page">
    <div class="address-body explorer-body">
      <div class="container" v-if="!loading && address">
        <div class="explorer-card">
          <header>
            <h1>Address</h1>
          </header>

          <div class="explorer-card-body">
            <section>
              <table class="explorer-table">
                <tr>
                  <td class="td-title">id</td>
                  <td>{{ address.id }}</td>
                </tr>
                <tr>
                  <td class="td-title">Balance</td>
                  <td>{{ address.balance | amount }}</td>
                </tr>
                <tr>
                  <td class="td-title">Transactions</td>
                  <td>{{ address.txCount | number }}</td>
                </tr>
              </table>
            </section>
          </div>
        </div>
        <div class="explorer-card" v-for="(shard, index) in address.shardData" :key="index">
          <header>
            <h1>Shard {{ index }}</h1>
          </header>
          <div class="explorer-card-body">
            <section>
              <div v-if="shard.err" class="text-error">{{ shard.err }}</div>
              <table class="explorer-table" v-else>
                <tr>
                  <td class="td-title">Balance</td>
                  <td>{{ shard.balance | amount }}</td>
                </tr>
                <tr>
                  <td class="td-title">Transactions</td>
                  <td>{{ shard.txCount | number }}</td>
                </tr>
              </table>
            </section>
          </div>
        </div>

        <div class="explorer-card">
          <div class="explorer-card-body">
            <section>
              <h2>Transactions</h2>
              <table class="explorer-table">
                <tr>
                  <th>TxHash</th>
                  <th>Timestamp</th>
                  <th>From ShardID</th>
                  <th>To ShardID</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Value</th>
                </tr>
                <tr v-for="tx in txs" :key="tx.hash">
                  <td>
                    <router-link :to="'/tx/' + tx.hash">{{ tx.hash | shorten }}</router-link>
                  </td>
                  <td>{{ (Number(tx.timestamp) * 1000) | timestamp }}</td>
                  <td>{{ tx.shardID }}</td>
                  <td>{{ tx.toShardID }}</td>
                  <td>
                    <router-link :to="'/address/' + tx.from">{{ tx.from | shorten }}</router-link>
                  </td>
                  <td>
                    <router-link :to="'/address/' + tx.to">{{ tx.to | shorten }}</router-link>
                  </td>
                  <td>{{ tx.value | amount }}</td>
                </tr>
              </table>
            </section>
          </div>
        </div>
      </div>
      <div class="container" v-else>
        <loading-message />
      </div>
    </div>
  </div>
</template>

<script>
import service from "../explorer/service";
import LoadingMessage from "./LoadingMessage";

export default {
  name: "AddressPage",
  data() {
    return {
      loading: true,
      address: null,
      txs: null
    };
  },
  components: {
    LoadingMessage
  },
  watch: {
    $route() {
      this.getAddress();
    }
  },
  mounted() {
    this.getAddress();
  },
  methods: {
    getAddress() {
      this.loading = true;
      let txs = [];
      service
        .getAddress(this.$route.params.address)
        .then(address => {
          address.shardData.forEach((data, idx) => {
            data.txs.forEach(tx => {
              tx.shardID = idx;
              if (!txs.some(t => t.hash === tx.hash)) {
                txs.push(tx);
              }
              if (
                tx.toShardID !== idx &&
                address.shardData[tx.toShardID] &&
                !address.shardData[tx.toShardID].txs.some(
                  t => t.hash === tx.hash
                )
              ) {
                address.shardData[tx.toShardID].txs.push(tx);
              }
            });
          });

          this.address = address;
        })
        .finally(() => {
          this.txs = txs.sort((a, b) =>
            Number(a.timestamp) < Number(b.timestamp) ? -1 : 1
          );
          this.loading = false;
        });
    }
  }
};
</script>
