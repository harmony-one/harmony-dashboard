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

            <section>
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
                    <router-link
                      tag="span"
                      class="disabled"
                      :to="'/address/' + tx.from"
                    >{{ tx.from | shorten }}</router-link>
                  </td>
                  <td>
                    <router-link
                      tag="span"
                      class="disabled"
                      :to="'/address/' + tx.to"
                    >{{ tx.to | shorten }}</router-link>
                  </td>
                  <td>{{ tx.value }}</td>
                </tr>
              </table>
            </section>
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