<style scoped lang="less">
@import "../less/common.less";

.explorer-page {
  background-color: #dfdfdf;
  .navbar-fixed-top {
    background-color: #262627;
  }
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.explorer-body {
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
  <div class="explorer-page page">
    <header class="navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <router-link class="navbar-brand" to="/"></router-link>
        </div>
      </div>
    </header>

    <div class="explorer-body">
      <div class="container" v-if="Object.keys(globalData.shardSummaries).length">
        <global-summary :summary="globalData.globalSummary"></global-summary>
        <shard-summary
          :summary="summary"
          v-for="(summary, key) in globalData.shardSummaries"
          :key="key"
        ></shard-summary>
      </div>
      <div class="container flex-hv-center" v-else>
        <div class="placeholder-text">No Data</div>
      </div>
    </div>
    <site-footer/>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../store";
import service from "../service";
import SiteFooter from "./SiteFooter";

export default {
  name: "ExplorerPage",
  data() {
    return {
      globalData: store.data
    };
  },
  components: {
    FontAwesomeIcon,
    SiteFooter
  },
  mounted() {}
};
</script>