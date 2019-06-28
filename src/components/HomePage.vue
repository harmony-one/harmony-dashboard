<style scoped lang="less">
@import "../less/common.less";

.explorer-table-responsive {
  display: table;
  width: 100%;
  height: 25em;
  border-collapse: collapse;
  .th,
  .td {
    padding: @space-sm @space-xs;
    display: table-cell;
    text-align: left;
  }
  .tr {
    display: table-row;
  }
  .th {
    font-weight: bold;
    color: #777;
    font-size: 0.8em;
  }

  .td {
    color: var(--color-table-text);
    transition: all @anim-duration @anim-easing;
    word-break: break-word;
  }
  .tr:hover .td {
    color: var(--color-table-text-hover);
    background-color: var(--color-table-background-hover);
  }
  .tr + .tr {
    border-top: solid 1px var(--color-table-border);
  }
}

.home-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;
  header {
    .flex-horizontal;
    align-items: flex-end;
    .timer {
      color: #666;
    }
  }
  .secondary-info {
    font-size: 0.8em;
  }
  .latest-block-card {
    table {
      th {
        position: sticky;
        top: 0;
        background-color: var(--color-card-background);
      }
      height: 20em;
      overflow: auto;
    }
    footer {
      padding: 0;
      .btn {
        padding: @space-md;
      }
    }
  }
}

.icon-column {
  padding: 0 @space-md;
  height: 100%;
  .flex-hv-center();
}
.data-num-column {
  padding: @space-md;
  .data-num {
    font-size: 2em;
    color: #1b295e;
  }
  h1 {
    font-size: 1em;
    font-weight: normal;
  }
}
.data-icon-circle {
  width: 2em;
  height: 2em;
  .hmy-bg();
  border-radius: 100%;

  .data-icon {
    width: 100%;
    height: 100%;
    background-size: 60% 60%;
    background-repeat: no-repeat;
    background-position: center;
    &.icon-block-count {
      background-image: url(../assets/block-count.svg);
    }
    &.icon-tx-count {
      background-image: url(../assets/tx-count.svg);
    }
    &.icon-node-count {
      background-image: url(../assets/node-count.svg);
    }
    &.icon-shard-count {
      background-image: url(../assets/shard-count.svg);
    }
  }
}

.google-map-container {
  padding: 0;
  .google-map {
    width: 100%;
    height: 30em;
  }
}
</style>

<template>
  <div class="home-page explorer-page page">
    <div class="home-body explorer-body">
      <div class="container">
        <template v-if="globalData.latestBlocks.length">
          <div class="explorer-card">
            <div class="row">
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <div class="flex-horizontal">
                  <div class="icon-column">
                    <div class="data-icon-circle">
                      <div class="data-icon icon-block-count"></div>
                    </div>
                  </div>
                  <div class="data-num-column">
                    <div class="data-num">{{ globalData.blockCount | number }}</div>
                    <h1>Block Count</h1>
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <div class="flex-horizontal">
                  <div class="icon-column">
                    <div class="data-icon-circle">
                      <div class="data-icon icon-tx-count"></div>
                    </div>
                  </div>
                  <div class="data-num-column">
                    <div class="data-num">{{ globalData.avgBlockLatency | blockLatency }}</div>
                    <h1>Block Latency</h1>
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <div class="flex-horizontal">
                  <div class="icon-column">
                    <div class="data-icon-circle">
                      <div class="data-icon icon-node-count"></div>
                    </div>
                  </div>
                  <div class="data-num-column">
                    <div class="data-num">{{ globalData.nodeCount | number }}</div>
                    <h1>Node Count</h1>
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <div class="flex-horizontal">
                  <div class="icon-column">
                    <div class="data-icon-circle">
                      <div class="data-icon icon-shard-count"></div>
                    </div>
                  </div>
                  <div class="data-num-column">
                    <div class="data-num">{{ globalData.shardCount | number }}</div>
                    <h1>Shard Count</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div class="explorer-card latest-block-card">
                <header>
                  <h1 class="flex-grow">Latest Blocks</h1>
                  <div class="secondary-info">
                    <div
                      class="timer"
                    >Settled {{ globalData.latestBlocks.length }} new block(s) {{ Math.round(Math.max((now - globalData.lastUpdateTime) / 1000, 0)) | number }}s ago...</div>
                    <span class="total-block-num"></span>
                  </div>
                </header>
                <div class="explorer-card-body">
                  <div class="explorer-table-responsive latest-block-table">
                    <div class="tr">
                      <div class="th">Shard</div>
                      <div class="th">Hash</div>
                      <div class="th">Height</div>
                      <div class="th text-right">Timestamp</div>
                      <div class="th text-right">Age</div>
                      <!-- <div class="th text-right">Transactions</div> -->
                    </div>
                    <div class="tr" v-for="block in globalData.latestBlocks" :key="block.id">
                      <div class="td">
                        <!-- <router-link :to="'/shard/' + block.shardID">{{ block.shardID }}</router-link> -->
                        {{ block.shardID }}
                      </div>
                      <div class="td">
                        <router-link :to="'/block/' + block.id">{{block.id | shorten}}</router-link>
                      </div>
                      <div class="td">
                        <router-link :to="'/block/' + block.id">{{block.height}}</router-link>
                      </div>
                      <div class="td text-right">{{ block.timestamp | timestamp }}</div>
                      <div class="td text-right">{{ block.timestamp | age }}</div>
                      <!-- <div class="td text-right">{{ block.txCount }}</div> -->
                    </div>
                  </div>
                </div>
                <footer>
                  <router-link
                    tag="button"
                    class="btn btn-light btn-block btn-mini"
                    to="blocks"
                  >View all blocks</router-link>
                </footer>
              </div>
            </div>
            <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div class="explorer-card latest-block-card">
              <header>
                <h1 class="flex-grow">Latest Transactions</h1>
                <div class="secondary-info">
                  <div
                    class="timer"
                  >Updated {{ Math.round(Math.max((now - globalData.lastUpdateTime) / 1000, 0)) | number }}s ago...</div>
                  <span class="total-block-num"></span>
                </div>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-tx-table">
                  <div class="tr">
                    <div class="th">Shard</div>
                    <div class="th">From</div>
                    <div class="th">To</div>
                    <div class="th">Age</div>
                    <div class="th text-right">Value</div>
                  </div>
                  <div class="tr" v-for="tx in globalData.latestTxs" :key="tx.id">
                    <div class="td">
                      <router-link :to="'/shard/' + tx.shardID">{{ tx.shardID }}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/address/' + tx.from">{{tx.from | shorten }}</router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/address/' + tx.to">{{tx.to | shorten }}</router-link>
                    </div>
                    <div class="td">{{ tx.timestamp | age }}</div>
                    <div class="td text-right">{{ tx.value | amount }}</div>
                  </div>
                </div>
              </div>
              <footer>
                <router-link
                  tag="button"
                  class="btn btn-light btn-block btn-mini"
                  to="txs"
                >View all transactions</router-link>
              </footer>
            </div>
            </template>-->
          </div>
        </template>
        <template class="container" v-else>
          <loading-message/>
        </template>
        <div class="explorer-card">
          <header>
            <h1 class="flex-grow">All Nodes</h1>
          </header>
          <div class="explorer-card-body google-map-container">
            <div class="google-map" ref="googleMap"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../explorer/store";
import service from "../explorer/service";
import LoadingMessage from "./LoadingMessage";
import moment from "moment";
var locations = [
  { lat: -6.9217, lng: 107.6071 },
  { lat: 40.5569, lng: -74.4847 },
  { lat: 40.8302, lng: -74.1299 },
  { lat: 22.3383, lng: 114.15 },
  { lat: 22.3383, lng: 114.15 },
  { lat: 52.3909, lng: 4.66476 },
  { lat: 49.1247, lng: 10.7806 },
  { lat: 37.5665, lng: 126.978 },
  { lat: -33.8675, lng: 151.207 },
  { lat: 1.28009, lng: 103.851 },
  { lat: 35.6895, lng: 139.692 },
  { lat: 35.6895, lng: 139.692 },
  { lat: 19.076, lng: 72.8777 },
  { lat: -33.8675, lng: 151.207 },
  { lat: -33.8675, lng: 151.207 },
  { lat: -33.8675, lng: 151.207 },
  { lat: 1.28009, lng: 103.851 },
  { lat: 59.3293, lng: 18.0686 },
  { lat: 59.3293, lng: 18.0686 },
  { lat: 37.3394, lng: -121.895 },
  { lat: 37.3394, lng: -121.895 },
  { lat: 37.3394, lng: -121.895 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 37.3598, lng: -121.981 },
  { lat: 50.1109, lng: 8.68213 },
  { lat: 37.3598, lng: -121.981 },
  { lat: 40.5569, lng: -74.4847 },
  { lat: 40.7357, lng: -74.1724 },
  { lat: 40.5569, lng: -74.4847 },
  { lat: 40.7128, lng: -74.0059 },
  { lat: 40.5569, lng: -74.4847 },
  { lat: 37.5665, lng: 126.978 },
  { lat: 48.1044, lng: 11.601 },
  { lat: 51.5074, lng: -0.127758 },
  { lat: 37.3417, lng: -121.9753 },
  { lat: 51.5074, lng: -0.127758 },
  { lat: 1.28009, lng: 103.851 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 53.3498, lng: -6.26031 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 45.5231, lng: -122.676 },
  { lat: 45.5231, lng: -122.676 },
  { lat: 45.5231, lng: -122.676 },
  { lat: 45.5231, lng: -122.676 },
  { lat: 52.6016, lng: -2.11035 },
  { lat: 40.726, lng: -74.0083 },
  { lat: 40.726, lng: -74.0083 },
  { lat: 40.726, lng: -74.0083 },
  { lat: 40.726, lng: -74.0083 },
  { lat: 40.5569, lng: -74.4847 },
  { lat: 40.5569, lng: -74.4847 },
  { lat: 40.5569, lng: -74.4847 },
  { lat: 40.7357, lng: -74.1724 },
  { lat: 40.5569, lng: -74.4847 },
  { lat: 40.5569, lng: -74.4847 },
  { lat: 1.38681, lng: 103.891 },
  { lat: 35.6895, lng: 139.692 },
  { lat: 50.1109, lng: 8.68213 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 40.0992, lng: -83.1141 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 45.5231, lng: -122.676 },
  { lat: 45.5231, lng: -122.676 },
  { lat: 45.5231, lng: -122.676 },
  { lat: 45.5231, lng: -122.676 },
  { lat: 45.5231, lng: -122.676 },
  { lat: 45.5231, lng: -122.676 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 53.3498, lng: -6.26031 },
  { lat: 43.6532, lng: -79.3832 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 40.7357, lng: -74.1724 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: -6.23854, lng: 106.824 },
  { lat: 33.7777, lng: -84.4211 },
  { lat: 40.7128, lng: -74.0059 },
  { lat: 40.7357, lng: -74.1724 },
  { lat: 40.7128, lng: -74.0059 },
  { lat: 40.7357, lng: -74.1724 },
  { lat: 40.7128, lng: -74.0059 },
  { lat: 40.7357, lng: -74.1724 },
  { lat: 34.1076, lng: -118.6023 },
  { lat: 52.3702, lng: 4.89517 },
  { lat: 52.3702, lng: 4.89517 },
  { lat: 52.3702, lng: 4.89517 },
  { lat: 45.5235, lng: -122.676 },
  { lat: 48.8566, lng: 2.35222 },
  { lat: 1.28009, lng: 103.851 },
  { lat: 50.1109, lng: 8.68213 },
  { lat: 45.5231, lng: -122.676 },
  { lat: 48.8566, lng: 2.35222 },
  { lat: 37.3394, lng: -121.895 },
  { lat: -23.5505, lng: -46.6333 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 37.3394, lng: -121.895 },
  { lat: 37.3394, lng: -121.895 },
  { lat: 37.3394, lng: -121.895 },
  { lat: 1.28009, lng: 103.851 },
  { lat: 1.28009, lng: 103.851 },
  { lat: 37.3394, lng: -121.895 },
  { lat: 37.3394, lng: -121.895 },
  { lat: 45.5235, lng: -122.676 },
  { lat: 45.5235, lng: -122.676 },
  { lat: 37.3394, lng: -121.895 },
  { lat: 35.709, lng: 139.732 },
  { lat: 45.5235, lng: -122.676 },
  { lat: -33.8675, lng: 151.207 },
  { lat: -23.5505, lng: -46.6333 },
  { lat: 45.5235, lng: -122.676 },
  { lat: 37.3394, lng: -121.895 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 45.5235, lng: -122.676 },
  { lat: 1.28009, lng: 103.851 },
  { lat: 1.28009, lng: 103.851 },
  { lat: 37.3394, lng: -121.895 },
  { lat: 45.5235, lng: -122.676 },
  { lat: 53.3498, lng: -6.26031 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 50.1109, lng: 8.68213 },
  { lat: 33.5679, lng: -117.7046 },
  { lat: 40.5511, lng: -74.4606 },
  { lat: 40.4292, lng: -74.2483 },
  { lat: 40.4292, lng: -74.2483 },
  { lat: 48.1497, lng: 11.585 },
  { lat: 37.3394, lng: -121.895 },
  { lat: 39.0438, lng: -77.4874 },
  { lat: 53.3498, lng: -6.26031 },
  { lat: 45.5235, lng: -122.676 },
  { lat: 35.709, lng: 139.732 }
];

export default {
  name: "HomePage",
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
    this.map();
  },
  computed: {
    length() {
      return Math.ceil(this.globalData.blocks.length / this.pageSize);
    }
  },
  methods: {
    resetTimer() {
      clearInterval(this.timer);
      this.now = Date.now();
      this.timer = setInterval(() => {
        this.now = Date.now();
      }, 1000);
    },
    map() {
      var map = new google.maps.Map(this.$refs.googleMap, {
        zoom: 3,
        center: { lat: -28.024, lng: 140.887 }
      });

      // Add some markers to the map.
      // Note: The code uses the JavaScript Array.prototype.map() method to
      // create an array of markers based on a given "locations" array.
      // The map() method here has nothing to do with the Google Maps API.
      var markers = locations.map(function(location, i) {
        return new google.maps.Marker({
          position: location
        });
      });

      // Add a marker clusterer to manage the markers.
      var markerCluster = new MarkerClusterer(map, markers, {
        imagePath:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
      });
    }
  }
};
</script>