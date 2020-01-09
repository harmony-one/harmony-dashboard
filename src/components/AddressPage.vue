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
        <div
          class="explorer-card"
          v-for="(shard, index) in address.shardData"
          :key="index"
        >
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
            <section>
              <h2>Latest Transactions</h2>
              <table class="explorer-table">
                <tr>
                  <th>TxHash</th>
                  <th>Timestamp</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Value</th>
                </tr>
                <tr v-for="tx in shard.txs" :key="tx.hash">
                  <td>
                    <router-link :to="'/tx/' + tx.hash">{{
                      tx.hash | shorten
                    }}</router-link>
                  </td>
                  <td>{{ tx.timestamp | timestamp }}</td>
                  <td>
                    <router-link :to="'/address/' + tx.from">{{
                      tx.from | shorten
                    }}</router-link>
                  </td>
                  <td>
                    <router-link :to="'/address/' + tx.to">{{
                      tx.to | shorten
                    }}</router-link>
                  </td>
                  <td>{{ tx.value | amount }}</td>
                </tr>
              </table>
            </section>
          </div>
          <footer class="button-only-footer">
            <router-link
              tag="button"
              class="btn btn-light btn-block btn-mini"
              :to="{
                name: 'AddressShardPage',
                params: { address: $route.params.address, shardId: index }
              }"
              >View all</router-link
            >
          </footer>
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
      address: null
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
      service
        .getAddress(this.$route.params.address)
        .then(address => {
          address.shardData.forEach((data, idx) =>
            data.txs.forEach(tx => {
              if (
                tx.toShardID !== idx &&
                address.shardData[tx.toShardID] &&
                !address.shardData[tx.toShardID].txs.some(
                  t => t.hash === tx.hash
                )
              ) {
                address.shardData[tx.toShardID].txs.push(tx);
              }
            })
          );

          this.address = address;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
