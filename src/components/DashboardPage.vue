<style scoped lang="less">
@import "../less/common.less";

.dashboard-page {
  background-color: #dfdfdf;
  .navbar-fixed-top {
    background-color: #262627;
  }
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.dashboard-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;

  > .container {
    padding-top: 6em;
    padding-bottom: 1em;

    .placeholder-text {
      color: var(--secondary-text-color);
      font-size: 3em;
    }
  }
}

footer {
  padding-bottom: @space-lg;
  background: linear-gradient(0deg, #262627 0, #525254 100%);
  color: #a09ea7;
  .container {
    text-align: center;
    padding: @space-md 0;
  }
  .community {
    .svg-inline--fa {
      font-size: 1.5em;
      margin: 0.5em;
      cursor: pointer;
    }
  }

  a {
    transition: color @anim-duration @anim-easing;

    &:hover {
      color: var(--bright-text-color);
    }
  }

  .links {
    font-size: 0.8em;
  }

  .copyright {
    font-size: 0.6em;
    color: #868390;
  }
}
</style>

<template>
  <div class="dashboard-page page">
    <header class="navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <router-link class="navbar-brand" to="/">
          </router-link>
        </div>
      </div>
    </header>

    <div class="dashboard-body">
      <div class="container" v-if="Object.keys(globalData.shardSummaries).length">
        <global-summary :summary="globalData.globalSummary"></global-summary>
        <shard-summary :summary="summary" v-for="(summary, key) in globalData.shardSummaries" :key="key"></shard-summary>
      </div>
      <div class="container flex-hv-center" v-else>
        <div class="placeholder-text">
          No Data
        </div>
      </div>
    </div>

    <footer>
      <div class="community container">
        <a href="https://medium.com/harmony-one" target="_blank">
          <font-awesome-icon :icon="['fab', 'medium']" />
        </a>

        <a href="https://twitter.com/harmonyprotocol" target="_blank">
          <font-awesome-icon :icon="['fab', 'twitter']" />
        </a>

        <a href="https://www.instagram.com/harmony.protocol/" target="_blank">
          <font-awesome-icon :icon="['fab', 'instagram']" />
        </a>

        <a href="https://t.me/harmony_one" target="_blank">
          <font-awesome-icon :icon="['fab', 'telegram']" />
        </a>

      </div>
      <div class="links container">
        <a href="#" target="_blank">Terms of Use</a>
        |
        <a href="#" target="_blank">Privacy Policy</a>
      </div>
      <div class="copyright container">
        Copyright © 2018 harmony | All rights reserved
      </div>
    </footer>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../store";
import service from "../service";
const ws = new WebSocket(`ws://${service.BACK_END_URL}`);

export default {
  name: "DashboardPage",
  data() {
    return {
      globalData: store.data
    };
  },
  components: {
    FontAwesomeIcon
  },
  mounted() {
    ws.addEventListener("open", () => {
      ws.send("front-end: Hi.");
    });

    ws.addEventListener("message", res => {
      let data = JSON.parse(res.data);
      if (data.cmd === "reset") {
        store.reset();
      } else {
        store.update(data);
      }
    });

    ws.addEventListener("error", error => {
      console.log("error", error);
    });

    ws.addEventListener("close", error => {
      console.log("close");
    });
  }
};
</script>