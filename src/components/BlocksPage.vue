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
  .pull-left {
    float: left;
  }
  .pagination-row {
    .flex-horizontal;
    margin: @space-sm 0;
    text-align: right;
    float: right;
    font-size: 0.8em;
    .total-block-num {
      margin-right: @space-md;
    }
    .pagination-nums {
      margin-left: @space-md;
    }
  }
}
</style>

<template>
  <div class="blocks-page explorer-page page">
    <div class="blocks-body explorer-body">
      <div class="container" v-if="globalData.blocks.length">
        <div class="explorer-card">
          <header>
            <h1 class="pull-left">Latest Blocks</h1>
            <div class="pagination-row">
              <span class="total-block-num">{{ globalData.blocks.length }} blocks</span>
              <button
                class="btn btn-light btn-icon-only"
                @click="prev()"
                :disabled="pageIndex === 0"
              >
                <font-awesome-icon icon="chevron-left"/>
              </button>
              <button
                class="btn btn-light btn-icon-only"
                @click="next()"
                :disabled="pageIndex === length - 1"
              >
                <font-awesome-icon icon="chevron-right"/>
              </button>
              <span class="pagination-nums">{{ pageIndex + 1 }} / {{ length }}</span>
            </div>
          </header>
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
              <td>{{ block.timestamp | timestamp }}</td>
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
const ws = new WebSocket(`ws://${service.EXPLORER_BACKEND_URL}`);

export default {
  name: "BlocksPage",
  data() {
    return {
      globalData: store.data,
      pageIndex: 0,
      pageSize: 50
    };
  },
  components: {
    FontAwesomeIcon,
    LoadingMessage
  },
  mounted() {
    ws.addEventListener("open", () => {
      ws.send("front-end: Hi.");
    });

    ws.addEventListener("message", res => {
      let data = JSON.parse(res.data);
      if (data.cmd === "reset") {
        store.reset();
      } else if (data.cmd === "blocks") {
        store.updateBlocks(data.blocks);
      }
    });

    ws.addEventListener("error", error => {
      console.log("error", error);
    });

    ws.addEventListener("close", error => {
      console.log("close");
    });
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