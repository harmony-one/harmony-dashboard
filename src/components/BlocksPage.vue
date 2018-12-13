<style scoped lang="less">
@import "../less/common.less";

.blocks-body {
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
  <div class="blocks-page explorer-page page">
    <div class="blocks-body explorer-body">
      <div class="container" v-if="globalData.blocks.length">
        <h1>Latest Blocks</h1>
        <table class="explorer-table">
          <tr>
            <th>Height</th>
            <th>Timestamp</th>
            <th class="text-right">Transactions</th>
            <th class="text-right">Size (bytes)</th>
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
      <div class="container" v-else>
        <loading-message/>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../store";
import service from "../service";
import LoadingMessage from "./LoadingMessage";

export default {
  name: "BlocksPage",
  data() {
    return {
      globalData: store.data
    };
  },
  components: {
    FontAwesomeIcon,
    LoadingMessage
  },
  mounted() {
    service.getBlocks();
  }
};
</script>