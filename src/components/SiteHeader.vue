<style scoped lang="less">
@import "../less/common.less";
.navbar-fixed-top {
  background-color: #262627;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1000;
  top: 0;
  color: var(--bright-text-color);
  transition: background-color @anim-duration @anim-easing,
    color @anim-duration @anim-easing;
  a.navbar-brand {
    height: 5em;
    width: 8em;
    box-sizing: border-box;
    background-image: url(../assets/harmony-logo-white.svg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 7em;
    margin-left: -@space-md;
  }
  &.opaque {
    background-color: #fff;
    color: var(--opaque-navbar-text-color);
    border-bottom: 1px solid #0a93eb;
    .navbar-header .navbar-toggle {
      .icon-burger,
      .icon-cross {
        .icon-bar {
          background-color: #346aa9;
        }
      }
    }
    a.navbar-brand {
      background-image: url(../assets/harmony-logo-color.svg);
    }
  }
  .navbar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    .navbar-toggle {
      margin: @space-lg @space-md;
      padding: @space-sm;
      position: relative;
      .icon-container {
        position: relative;
      }
      .icon-burger,
      .icon-cross {
        width: 2em;
        height: 2em;
        position: absolute;
        top: 0;
        left: 0;
        transition: transform @anim-duration @anim-easing,
          opacity @anim-duration @anim-easing;
        &:not(.active) {
          opacity: 0;
        }
        .icon-bar {
          background-color: #fff;
          display: block;
          width: 1.5em;
          height: 2px;
          border-radius: 1px;
        }
      }
      .icon-burger:not(.active) {
        transform: rotate(180deg) scaleY(0);
      }
      .icon-cross:not(.active) {
        transform: rotate(-180deg) scaleY(0);
      }
      .icon-burger {
        .icon-bar {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .icon-bar:first-child {
          margin-top: -6px;
        }
        .icon-bar:last-child {
          margin-top: 6px;
        }
      }
      .icon-cross {
        position: relative;
        .icon-bar {
          position: absolute;
          top: 50%;
          left: 50%;
        }
        .icon-bar:first-child {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        .icon-bar:last-child {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      }
    }
    .navbar-collapse {
      flex: 1;
      text-align: right;
      .navbar-nav {
        a {
          transition: background-color @anim-duration @anim-easing;
          &:hover {
            background-color: var(--hover-background-color);
          }
        }
      }
    }

    .navbar-actions {
      display: flex;
      align-items: center;
    }
    a.navbar-nav {
      text-decoration: none;
      padding: @space-md @space-md;
      transition: color @anim-duration @anim-easing;
      color: #a09ea7;
      &:hover {
        color: inherit;
      }
    }
    .search {
      width: 15em;
      margin-left: @space-md;
      flex: none;
      height: 2em;
      overflow: hidden;
      position: relative;
      color: #666;
      .search-icon {
        position: absolute;
        top: 50%;
        left: @space-sm;
        transform: translateY(-50%);
      }
      input[type="text"] {
        border-radius: 2em;
        padding: @space-sm @space-md;
        padding-left: 3em;
        border: 0;
        width: 100%;
        height: 100%;
        background-color: #333;
        transition: background-color @anim-duration @anim-easing;
        &:focus {
          outline: none;
          box-shadow: none;
        }
      }

      input[type="text"]:focus {
        background-color: #ddd;
      }
    }
  }
}

@media (min-width: 768px) {
  .navbar-collapse.collapse {
    display: block !important;
  }
  .navbar-toggle {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar-collapse.collapse.show {
    flex-basis: 100%;
    .navbar-nav {
      display: flex;
      flex-direction: column;
      background-color: #fff;
      color: #333;
      text-align: center;
    }
  }
}
</style>
<template>
  <header class="navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <router-link class="navbar-brand" to="/"></router-link>
        <div class="navbar-actions">
          <router-link class="navbar-nav" to="/dashboard" v-if="showNav">Dashboard</router-link>
          <router-link class="navbar-nav" to="/blocks" v-if="showNav">Explorer</router-link>
          <div class="search">
            <font-awesome-icon class="search-icon" icon="search"/>
            <input
              type="text"
              placeholder="Block Hash / Tx Hash / Account..."
              v-model="input"
              @keyup.enter="search"
            >
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import service from "../explorer/service";
export default {
  name: "SiteHeader",
  data() {
    return {
      input: "",
      showNav: localStorage.getItem("nav")
    };
  },
  components: {
    FontAwesomeIcon
  },
  methods: {
    search(e) {
      let input = this.input.trim();
      this.input = "";
      if (!input) {
        //  || (input.length !== 32 && input.length !== 20)
        alert("invalid input");
        return;
      }
      service
        .search(input)
        .then(result => {
          if (result.type === "block") {
            this.$router.push(`/block/${input}`);
          } else if (result.type === "tx") {
            this.$router.push(`/tx/${input}`);
          } else if (result.type === "address") {
            this.$router.push(`/address/${input}`);
          }
        })
        .catch(r => {
          if (r.response && r.response.status === 401) {
            alert(r.response.data.error);
          } else {
            alert("Not Found!");
          }
        });
    }
  }
};
</script>