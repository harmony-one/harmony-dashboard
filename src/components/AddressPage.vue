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
                  <td>{{ Number(address.balance)/1000000000000000000 }}</td>
                </tr>
                <tr>
                  <td class="td-title">Transactions</td>
                  <td>{{ address.txCount }}</td>
                </tr>
              </table>
            </section>
          </div>
        </div>
        <div class="explorer-card" v-for="(shard, index) in address.shardData" :key="index">
          <header>
            <h1>Shard {{index}}</h1>
          </header>
          <div class="explorer-card-body">
            <section>
              <div v-if="shard.err" class="text-error">{{ shard.err }}</div>
              <table class="explorer-table" v-else>
                <tr>
                  <td class="td-title">Balance</td>
                  <td>{{ Number(shard.balance)/1000000000000000000 }}</td>
                </tr>
                <tr>
                  <td class="td-title">Transactions</td>
                  <td>{{ shard.txs.length }}</td>
                </tr>
              </table>
            </section>
            <!-- <section>
              <h2>Transactions</h2>
              <table class="explorer-table">
                <tr>
                  <th>TxHash</th>
                  <th>Timestamp</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Value</th>
                </tr>
                <tr v-for="tx in shard.txs" :key="tx.id">
                  <td>
                    <router-link :to="'/tx/' + tx.id">{{ tx.id | shorten }}</router-link>
                  </td>
                  <td>{{ tx.timestamp | timestamp }}</td>
                  <td>
                    <router-link :to="'/address/' + tx.from">{{ tx.from | shorten }}</router-link>
                  </td>
                  <td>
                    <router-link :to="'/address/' + tx.to">{{ tx.to | shorten }}</router-link>
                  </td>
                  <td>{{ Number(tx.value)/1000000000000000000 }}</td>
                </tr>
              </table>
            </section>-->
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
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../explorer/store";
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
    FontAwesomeIcon,
    LoadingMessage
  },
  watch: {
    $route(to, from) {
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
          this.address = address;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>