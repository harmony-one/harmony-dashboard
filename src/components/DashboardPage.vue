<template>
  <div class="dashboard-page page">
    <header class="navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <router-link class="navbar-brand" to="/">Harmony</router-link>
        </div>
      </div>
    </header>

    <div class="dashboard-body">
      <div class="container">
        <div class="row">
          <div class="col-xs-12
                col-sm-8
                col-md-6
                col-lg-4">
            <div class="dashboard-card">
              <div class="card-title"># of Blocks</div>
              <div class="card-value">{{ blockCount }}</div>
            </div>
          </div>
          <div class="col-xs-12
                col-sm-8
                col-md-6
                col-lg-4">
            <div class="dashboard-card">
              <div class="card-title"># of Transactions</div>
              <div class="card-value">{{ txCount }}</div>
            </div>
          </div>
          <div class="col-xs-12
                col-sm-8
                col-md-6
                col-lg-4">
            <div class="dashboard-card">
              <div class="card-title"># of Nodes Online</div>
              <div class="card-value">{{ nodeCount }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12
                col-sm-8
                col-md-6
                col-lg-4">
            <div class="dashboard-card">
              <div class="card-title">Latency</div>
              <div class="card-value">{{ latency }}</div>
            </div>
          </div>
          <div class="col-xs-12
                col-sm-8
                col-md-6
                col-lg-4">
            <div class="dashboard-card">
              <div class="card-title">Transaction Per Second</div>
              <div class="card-value">{{ tps }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer>
      <div class="community container">
        <a href="#">
          <font-awesome-icon :icon="['fab', 'github']" />
        </a>

        <a href="#">
          <font-awesome-icon :icon="['fab', 'twitter']" />
        </a>

        <a href="#">
          <font-awesome-icon :icon="['fab', 'telegram']" />
        </a>

        <a href="#">
          <font-awesome-icon :icon="['fab', 'facebook']" />
        </a>
      </div>
      <div class="links container">
        <a href="">Terms of Use</a>
        |
        <a href="">Privacy Policy</a>
      </div>
      <div class="copyright container">
        Copyright © 2018 harmony | All rights reserved
      </div>
    </footer>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import VueScrollTo from "vue-scrollto";

export default {
  name: "HomePage",
  data() {
    return {
      tps: 0,
      nodeCount: 0,
      blockCount: 0,
      txCount: 0,
      latency: 0
    };
  },
  methods: {},
  components: {
    FontAwesomeIcon
  },
  mounted() {
    setInterval(() => {
      this.tps = (Math.random() * 1000).toPrecision(5);
      this.nodeCount = Math.floor(Math.random() * 1000) + 100;
      this.blockCount = Math.floor(Math.random() * 1000) + 100;
      this.txCount = Math.floor(Math.random() * 1000) + 100;
      this.latency = Math.floor(Math.random() * 1000) + 100;
    }, 500);
  }
};
</script>

<style scoped lang="less">
@import "../less/common.less";

.dashboard-page {
  background-color: #dfdfdf;
  .navbar-fixed-top {
    background-color: #262627;
  }
}

.dashboard-body {
  width: 100%;
  height: 1000px;
  background-size: cover;
  background-position: bottom center;

  color: var(--primary-text-color);

  > .container {
    padding-top: 6em;
  }

  .dashboard-card {
    border-radius: @border-radius;
    background-color: #fff;
    padding: @space-md;
    display: block;
    min-width: 12em;
    margin: @space-sm 0;
    .card-title {
      color: var(--secondary-text-color);
    }
    .card-value {
      font-size: 3em;
      text-align: center;
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
