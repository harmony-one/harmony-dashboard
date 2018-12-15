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
        <div class="explorer-card">
          <h1>Latest Blocks</h1>
          <button class="btn btn-light" @click="prev()">
            <font-awesome-icon icon="chevron-left"/>
          </button>
          <button class="btn btn-light" @click="next()">
            <font-awesome-icon icon="chevron-right"/>
          </button>
          {{ pageIndex + 1 }} / {{ length }}
          <table class="explorer-table">
            <tr>
              <th>Shard</th>
              <th>Height</th>
              <th>Timestamp</th>
              <th class="text-right">Transactions</th>
              <th class="text-right">Size (bytes)</th>
            </tr>
            <tr
              class="container"
              v-for="block in globalData.blocks.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)"
              :key="block.hash"
            >
              <td>{{ block.shardID }}</td>
              <td>
                <router-link :to="'block/' + block.hash">{{block.height}}</router-link>
              </td>
              <td>{{ block.timestamp }}</td>
              <td class="text-right">{{ block.txCount }}</td>
              <td class="text-right">{{ block.size }}</td>
            </tr>
          </table>
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
  name: "BlocksPage",
  data() {
    return {
      globalData: store.data,
      pageIndex: 0,
      pageSize: 4
    };
  },
  components: {
    FontAwesomeIcon,
    LoadingMessage
  },
  mounted() {
    service.getBlocks();
  },
  computed: {
    length() {
      return Math.ceil(this.globalData.blocks.length / this.pageSize);
    }
  },
  methods: {
    prev() {
      if (this.pageIndex === 0) return;
      this.pageIndex--;
    },
    next() {
      if (this.pageIndex === this.length - 1) return;
      this.pageIndex++;
    }
  }
};
</script>