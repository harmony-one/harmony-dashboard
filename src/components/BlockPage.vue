<style scoped lang="less">
@import "../less/common.less";

.block-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;
  padding-top: 6em;
}
</style>

<template>
  <div class="block-page explorer-page page">
    <div class="block-body explorer-body">
      <div class="container" v-if="block">
        <div class="explorer-card">
          <h1>Block #{{ block.height }}</h1>
          <section>
            <table class="explorer-table">
              <tr>
                <td class="td-title">ID</td>
                <td>{{ block.hash }}</td>
              </tr>
              <tr>
                <td class="td-title">Number of Transactions</td>
                <td>{{ block.txCount }}</td>
              </tr>
              <tr>
                <td class="td-title">Height</td>
                <td>{{ block.height }}</td>
              </tr>
              <tr>
                <td class="td-title">Timestamp</td>
                <td>{{ block.timestamp }}</td>
              </tr>
              <tr>
                <td class="td-title">Merkle Root</td>
                <td>{{ block.merkleRoot }}</td>
              </tr>
              <tr>
                <td class="td-title">Bits</td>
                <td>{{ block.bits }}</td>
              </tr>
              <tr>
                <td class="td-title">Size (bytes)</td>
                <td>{{ block.bytes }}</td>
              </tr>
              <tr v-if="block.prevBlock">
                <td class="td-title">Previous Block</td>
                <td>
                  <router-link :to="'/block/' + block.prevBlock.id">{{ block.prevBlock.height }}</router-link>
                </td>
              </tr>
              <tr v-if="block.nextBlock">
                <td class="td-title">Next Block</td>
                <td>
                  <router-link :to="'/block/' + block.nextBlock.id">{{ block.nextBlock.height }}</router-link>
                </td>
              </tr>
            </table>
          </section>

          <section>
            <h2>Transactions</h2>
            <table class="explorer-table">
              <tr>
                <th>TxHash</th>
                <th>Age</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
              </tr>
              <tr v-for="tx in block.txs" :key="tx.hash">
                <td>
                  <router-link :to="'/tx/' + tx.hash">{{ tx.hash | shorten }}</router-link>
                </td>
                <td>{{ tx.timestamp }}</td>
                <td>
                  <router-link :to="'/address/' + tx.from">{{ tx.from | shorten }}</router-link>
                </td>
                <td>
                  <router-link :to="'/address/' + tx.to">{{ tx.to | shorten }}</router-link>
                </td>
                <td>{{ tx.value }}</td>
              </tr>
            </table>
          </section>
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
import service from "../service";
import LoadingMessage from "./LoadingMessage";

export default {
  name: "BlockPage",
  data() {
    return {
      block: null
    };
  },
  components: {
    FontAwesomeIcon,
    LoadingMessage
  },
  mounted() {
    service.getBlock(this.$route.params.blockId).then(block => {
      this.block = block;
    });
  }
};
</script>