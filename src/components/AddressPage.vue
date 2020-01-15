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
          </div>
        </div>

        <div class="explorer-card">
          <header>
            <h1 class="flex-grow">Transactions</h1>
            <div class="pagination-controls">
              <span class="total-tx-num">{{ txCount }} txs</span>
              <span class="page-controllers">
                <span class="page-navigator">
                  <button
                    class="btn btn-light btn-icon-only"
                    @click="first()"
                    :disabled="pageIndex === 0"
                  >
                    <font-awesome-icon icon="angle-double-left" />
                  </button>
                  <button
                    class="btn btn-light btn-icon-only"
                    @click="prev()"
                    :disabled="pageIndex === 0"
                  >
                    <font-awesome-icon icon="chevron-left" />
                  </button>
                  <span class="pagination-nums"
                    >{{ pageIndex + 1 }} / {{ pageCount }}</span
                  >
                  <button
                    class="btn btn-light btn-icon-only"
                    @click="next()"
                    :disabled="pageIndex === pageCount - 1"
                  >
                    <font-awesome-icon icon="chevron-right" />
                  </button>
                  <button
                    class="btn btn-light btn-icon-only"
                    @click="last()"
                    :disabled="pageIndex === pageCount - 1"
                  >
                    <font-awesome-icon icon="angle-double-right" />
                  </button>
                </span>
              </span>
            </div>
          </header>
          <div class="explorer-card-body">
            <section>
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
                    <router-link :to="'/tx/' + tx.hash">{{
                      tx.hash | shorten
                    }}</router-link>
                  </td>
                  <td>{{ (Number(tx.timestamp) * 1000) | timestamp }}</td>
                  <td>{{ tx.shardID }}</td>
                  <td>{{ tx.toShardID }}</td>
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
      pageIndex: 0,
      pageSize: 20,
      allTxs: []
    };
  },
  components: {
    LoadingMessage
  },
  computed: {
    txCount() {
      return this.allTxs.length;
    },
    pageCount() {
      return Math.ceil(this.txCount / this.pageSize);
    },
    txs() {
      const begin = this.pageIndex * this.pageSize;

      return this.allTxs.slice(begin, begin + this.pageSize);
    }
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
          address.shardData.forEach(data => {
            data.txs.forEach(tx => {
              if (!txs.some(t => t.hash === tx.hash)) {
                txs.push(tx);
              }
            });
          });

          this.address = address;
        })
        .finally(() => {
          this.allTxs = txs.sort((a, b) =>
            Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
          );
          this.loading = false;
        });
    },
    goToPage(index) {
      if (index < 0) index = 0;
      if (index >= this.pageCount) index = this.pageCount - 1;

      this.pageIndex = index;
    },
    first() {
      this.goToPage(0);
    },
    last() {
      this.goToPage(this.pageCount - 1);
    },
    prev() {
      if (this.pageIndex === 0) return;
      this.goToPage(this.pageIndex - 1);
    },
    next() {
      if (this.pageIndex === this.pageCount - 1) return;
      this.goToPage(this.pageIndex + 1);
    }
  }
};
</script>
