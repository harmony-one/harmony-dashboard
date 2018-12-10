<style scoped lang="less">
@import "../less/common.less";

.block-page {
  background-color: #dfdfdf;
  .navbar-fixed-top {
    background-color: #262627;
  }
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.block-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;
  padding-top: 6em;

  .block-table {
    border-collapse: collapse;
    width: 100%;
    text-align: left;
    margin-bottom: 3em;
    td.td-title {
      font-weight: bold;
    }
    td {
      padding: @space-sm;
    }
  }
}
</style>

<template>
  <div class="block-page page">
    <header class="navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <router-link class="navbar-brand" to="/"></router-link>
        </div>
      </div>
    </header>

    <div class="block-body">
      <div class="container" v-if="block">
        <h1>Block #{{ block.height }}</h1>
        <div>
          <b>Block Hash</b>
          {{ block.hash }}
        </div>

        <h2>Summary</h2>
        <table class="block-table">
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
          <tr>
            <td class="td-title">Previous Block</td>
            <td>
              <router-link :to="'/block/' + block.prevBlock.id">{{ block.prevBlock.height }}</router-link>
            </td>
          </tr>
          <tr>
            <td class="td-title">Next Block</td>
            <td>
              <router-link :to="'/block/' + block.nextBlock.id">{{ block.nextBlock.height }}</router-link>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <site-footer></site-footer>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../store";
import service from "../service";
import SiteFooter from "./SiteFooter";

export default {
  name: "BlockPage",
  data() {
    return {
      block: null
    };
  },
  components: {
    FontAwesomeIcon,
    SiteFooter
  },
  mounted() {
    service
      .getBlock(this.$route.params.blockId)
      .then(block => (this.block = block));
  }
};
</script>