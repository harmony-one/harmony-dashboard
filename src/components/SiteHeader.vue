<style scoped lang="less">
@import "../less/common.less";
.navbar-fixed-top {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1000;
  top: 0;
  color: var(--color-site-header-text);
  transition: background-color @anim-duration @anim-easing,
    color @anim-duration @anim-easing;
  a.navbar-brand {
    display: inline-block;
    height: 7em;
    width: 10em;
    box-sizing: border-box;
    background-image: url(../assets/harmony-logo-white.svg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 90%;
    margin-left: -@space-md;
  }

  .navbar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
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
  .tagline {
    font-weight: 200;
    margin-bottom: -0.2em;
  }
  .search {
    width: 15em;
    margin-left: @space-md;
    flex: none;
    height: 2em;
    overflow: hidden;
    position: relative;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 2em;
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
      background-color: transparent;
      &::placeholder {
        color: #fff;
      }
      &:focus {
        outline: none;
        box-shadow: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .search {
    width: 10em !important;
  }

  .tagline {
    display: none;
  }
}
</style>
<template>
  <header class="navbar-fixed-top hmy-bg">
    <div class="container">
      <div class="navbar-header">
        <div class="site-brand flex-horizontal">
          <router-link class="navbar-brand" to="/"></router-link>
          <span class="tagline">Open Consensus for 10B</span>
        </div>
        <div class="navbar-actions">
          <router-link class="navbar-nav" to="/dashboard" v-if="showNav"
            >Dashboard</router-link
          >
          <router-link class="navbar-nav" to="/blocks" v-if="showNav"
            >Explorer</router-link
          >
          <div class="search">
            <font-awesome-icon class="search-icon" icon="search" />
            <input
              type="text"
              placeholder="Block Hash / Tx Hash / Account..."
              v-model="input"
              @keyup.enter="search"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import service from "../explorer/service";
export default {
  name: "SiteHeader",
  data() {
    return {
      input: "",
      showNav: localStorage.getItem("nav")
    };
  },
  methods: {
    search() {
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
