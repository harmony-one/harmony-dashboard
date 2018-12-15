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
  header {
    .flex-horizontal;
    align-items: flex-end;
    .timer {
      margin-right: @space-lg;
      color: #666;
    }
  }
  .pagination-controls {
    .flex-horizontal;
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

  // .fade-enter-active,
  // .fade-leave-active {
  //   transition: all 1s;
  // }
  // .fade-enter {
  //   opacity: 0.2;
  //   transform: translateY(-0.5em);
  // }
  // .fade-leave-to {
  //   opacity: 0.2;
  //   transform: translateY(0.5em);
  // }
}
</style>

<template>
  <div class="blocks-page explorer-page page">
    <div class="blocks-body explorer-body">
      <div class="container" v-if="globalData.blocks.length">
        <div class="explorer-card">
          <header>
            <h1 class="flex-grow">Latest Blocks</h1>
            <div class="pagination-controls">
              <div
                class="timer"
              >Updated {{ Math.round(Math.max((now - globalData.lastUpdateTime) / 1000, 0)) | number }}s ago...</div>
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
          <div class="explorer-card-body">
            <table class="explorer-table">
              <tr>
                <th>Shard</th>
                <th>Height</th>
                <th>Timestamp</th>
                <th>Age</th>
                <th class="text-right">Transactions</th>
                <th class="text-right">Size (bytes)</th>
              </tr>
              <!-- <transition-group name="fade" tag="tbody"> -->
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
                <td>{{ getAge(block.timestamp) }}</td>
                <td class="text-right">{{ block.txCount }}</td>
                <td class="text-right">{{ block.bytes }}</td>
              </tr>
              <!-- </transition-group> -->
            </table>
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
import moment from "moment";
const ws = new WebSocket(`ws://${service.EXPLORER_BACKEND_URL}`);

export default {
  name: "BlocksPage",
  data() {
    return {
      globalData: store.data,
      pageIndex: 0,
      pageSize: 50,
      timer: null,
      now: Date.now()
    };
  },
  components: {
    FontAwesomeIcon,
    LoadingMessage
  },
  watch: {
    globalData() {
      this.resetTimer();
    }
  },
  mounted() {
    this.resetTimer();
    ws.addEventListener("open", () => {
      ws.send("front-end: Hi.");
    });

    ws.addEventListener("message", res => {
      let data = JSON.parse(res.data);
      if (data.cmd === "reset") {
        store.reset();
      } else if (data.cmd === "blocks") {
        store.update(data);
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
    },
    resetTimer() {
      clearInterval(this.timer);
      this.now = Date.now();
      this.timer = setInterval(() => {
        this.now = Date.now();
      }, 1000);
    },
    getAge(timestamp) {
      let d = moment.duration(
        Math.max(this.globalData.lastUpdateTime - timestamp, 0)
      );
      let arr = [d.days(), d.hours(), d.minutes(), d.seconds()];
      let units = ["day", "hour", "minute", "second"];
      let s = arr
        .map((time, i) => {
          if (!time) return "";
          return `${time} ${units[i]}${time > 1 ? "s" : ""}`;
        })
        .join(" ")
        .trim();
      return `> ${s ? s : "1 seconds"} ago`;
    }
  }
};
</script>