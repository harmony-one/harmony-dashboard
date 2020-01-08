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
                  <td class="td-title">Shard</td>
                  <td>{{ $route.params.shardId }}</td>
                </tr>
                <tr>
                  <td class="td-title">Balance</td>
                  <td>{{ address.balance | amount }}</td>
                </tr>
                <tr>
                  <td class="td-title">Transactions</td>
                  <td>{{ address.txCount }}</td>
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
            <table class="explorer-table">
              <tr>
                <th>TxHash</th>
                <th>Timestamp</th>
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
  name: "AddressShardPage",
  data() {
    return {
      loading: true,
      address: null,
      shardId: -1,
      pageIndex: 0,
      pageSize: 10,
      txs: null
    };
  },
  components: {
    LoadingMessage
  },
  computed: {
    txCount() {
      if (!this.address) return 0;
      return this.address.txCount;
    },
    pageCount() {
      return Math.ceil(this.txCount / this.pageSize);
    }
  },
  watch: {
    $route(to) {
      let address = to.params.address;
      let shardId = +to.params.shardId;
      if (
        !this.address ||
        this.address.id !== address ||
        this.shardId !== shardId
      ) {
        this.getAddress();
      }
      let pageIndex = (+to.params.pageIndex || 1) - 1;
      this.pageIndex = pageIndex;
      this.shardId = shardId;
      service
        .getAddressShardTxHistory(
          address,
          shardId,
          this.pageIndex,
          this.pageSize
        )
        .then(txs => {
          this.txs = txs;
        });
    }
  },
  mounted() {
    this.getAddress().then(() => {
      let pageIndex = (+this.$route.params.pageIndex || 1) - 1;
      // let shardId = +this.$route.params.shardId;
      service
        .getAddressShardTxHistory(
          this.$route.params.address,
          this.$route.params.shardId,
          pageIndex,
          this.pageSize
        )
        .then(txs => {
          this.txs = txs;
        });
    });
  },
  methods: {
    getAddress() {
      this.loading = true;
      return service
        .getAddressShardSummary(
          this.$route.params.address,
          this.$route.params.shardId
        )
        .then(address => {
          this.address = address;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    goToPage(index) {
      if (index < 0) index = 0;
      if (index >= this.pageCount) index = this.pageCount - 1;
      this.$router.replace({
        name: "AddressShardPage",
        params: { pageIndex: index + 1 }
      });
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
