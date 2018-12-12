<style scoped lang="less">
@import "../less/common.less";

.blocks-page {
  background-color: #dfdfdf;
}

.blocks-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;
  padding-top: 6em;

  h1 {
    margin-bottom: @space-sm;
  }

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
      border-bottom: solid 1px var(--color-border);
    }
  }
}
</style>

<template>
  <div class="blocks-page page">
    <div class="blocks-body">
      <div class="container">
        <h1>Latest Blocks</h1>
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
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../store";
import service from "../service";

export default {
  name: "BlocksPage",
  data() {
    return {
      globalData: store.data
    };
  },
  components: {
    FontAwesomeIcon
  },
  mounted() {
    service.getBlocks();
  }
};
</script>