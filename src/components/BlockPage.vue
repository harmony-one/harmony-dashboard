<style scoped lang="less">
@import "../less/common.less";
</style>

<template>
  <div class="block-page explorer-page page">
    <div class="block-body explorer-body">
      <div class="container" v-if="!loading && block">
        <div class="explorer-card">
          <header>
            <h1>Block #{{ block.height }}</h1>
          </header>
          <div class="explorer-card-body">
            <section>
              <table class="explorer-table">
                <tr>
                  <td class="td-title">ID</td>
                  <td>{{ block.id }}</td>
                </tr>
                <!-- <tr>
                  <td class="td-title">Number of Transactions</td>
                  <td>{{ block.txCount }}</td>
                </tr>-->
                <tr>
                  <td class="td-title">Height</td>
                  <td>{{ block.height }}</td>
                </tr>
                <tr>
                  <td class="td-title">Timestamp</td>
                  <td>{{ block.timestamp | timestamp }}</td>
                </tr>
                <tr>
                  <td class="td-title">Merkle Root</td>
                  <td>{{ block.merkleRoot }}</td>
                </tr>
                <tr>
                  <td class="td-title">Size (bytes)</td>
                  <td>{{ block.bytes }}</td>
                </tr>
                <tr>
                  <td class="td-title">Included In Shard</td>
                  <td>{{ block.shardID }}</td>
                </tr>
                <tr>
                  <td class="td-title">Previous Block</td>
                  <td v-if="block.prevBlock && block.prevBlock.id">
                    <router-link :to="'/block/' + block.prevBlock.id">{{ block.prevBlock.height }}</router-link>
                  </td>
                  <td v-else>-</td>
                </tr>
                <tr>
                  <td class="td-title">Next Block</td>
                  <td v-if="block.nextBlock && block.nextBlock.id">
                    <router-link :to="'/block/' + block.nextBlock.id">{{ block.nextBlock.height }}</router-link>
                  </td>
                  <td v-else>-</td>
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
                <tr v-for="tx in block.txs" :key="tx.id">
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
        <loading-message/>
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
  name: "BlockPage",
  data() {
    return {
      loading: true,
      block: null
    };
  },
  components: {
    FontAwesomeIcon,
    LoadingMessage
  },
  watch: {
    $route(to, from) {
      this.getBlock();
    }
  },
  mounted() {
    this.getBlock();
  },
  methods: {
    getBlock() {
      this.loading = true;
      service
        .getBlock(this.$route.params.blockId)
        .then(block => (this.block = block))
        .finally(() => (this.loading = false));
    }
  }
};
</script>