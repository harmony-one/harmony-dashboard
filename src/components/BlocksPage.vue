<style scoped lang="less">
@import "../less/common.less";

.blocks-page {
  background-color: #dfdfdf;
  .navbar-fixed-top {
    background-color: #262627;
  }
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.blocks-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;
  padding-top: 6em;

  .blocks-table {
    border-collapse: collapse;
    width: 100%;
    text-align: left;
    margin-bottom: 3em;
    th,
    td {
      padding: @space-sm;
    }
    th {
      border-bottom: solid 2px var(--color-border);
    }
    tr:nth-child(odd) td {
      background-color: #ccc;
    }
  }
}
</style>

<template>
  <div class="blocks-page page">
    <header class="navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <router-link class="navbar-brand" to="/"></router-link>
        </div>
      </div>
    </header>

    <div class="blocks-body">
      <div class="container">
        <table class="blocks-table">
          <tr>
            <th>Height</th>
            <th>Timestamp</th>
            <th class="text-right">Transactions</th>
            <th class="text-right">Size</th>
          </tr>
          <tr class="container" v-for="block in globalData.blocks" :key="block.id">
            <td>
              <router-link :to="'block/' + block.id">{{block.height}}</router-link>
            </td>
            <td>{{ block.timestamp }}</td>
            <td class="text-right">{{ block.txCount }}</td>
            <td class="text-right">{{ block.size }}</td>
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
  name: "BlocksPage",
  data() {
    return {
      globalData: store.data
    };
  },
  components: {
    FontAwesomeIcon,
    SiteFooter
  },
  mounted() {
    service.getBlocks();
  }
};
</script>