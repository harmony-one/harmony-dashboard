<style scoped lang="less">
@import "../less/common.less";

.admin-page {
  background-color: #dfdfdf;
  .navbar-fixed-top {
    background-color: #262627;
  }
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.admin-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;

  > .container {
    padding-top: 6em;
    padding-bottom: 1em;

    .admin-card {
      width: 15em;
    }
    header {
      font-size: 1.5em;
      text-align: center;
      font-weight: bold;
    }

    label {
      display: block;
      margin: 0.5em 0;

      input[type="password"] {
        display: block;
        margin: @space-xs 0;
        width: 100%;
      }
    }

    .btn {
      margin-top: @space-md;
      float: right;
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
  <div class="admin-page page">
    <header class="navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <router-link class="navbar-brand" to="/">
          </router-link>
        </div>
      </div>
    </header>

    <div class="admin-body">
      <div class="container flex-hv-center">
        <div class="card admin-card">
          <header>Reset Dashboard</header>
          <label>
            Secret:
            <input type="password" v-model="secret">
          </label>
          <button class="btn btn-primary" @click="reset">Reset</button>
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
import service from "../service";

export default {
  name: "AdminPage",
  data() {
    return {
      secret: ""
    };
  },
  components: {
    FontAwesomeIcon
  },
  mounted() {},
  methods: {
    reset() {
      service.reset(this.secret).then(
        () => {
          alert("Reset Successful!");
        },
        () => {
          alert("Reset Failed!");
        }
      );
    }
  }
};
</script>