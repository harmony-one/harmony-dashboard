<style scoped lang="less">
@import '../less/common.less';
.navbar-fixed-top {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 10;
  top: 0;
  color: var(--color-site-header-text);
  transition: background-color @anim-duration @anim-easing,
    color @anim-duration @anim-easing;
  a.navbar-brand {
    display: inline-block;
    height: 4em;
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
    color: white;
    border-radius: 5px;
    padding: @space-md @space-md;
    margin: 2px;
    box-shadow: 0 0px 0px rgba(0,0,0,0.15);
    transition: box-shadow 0.3s ease-in-out;
    &:hover {
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
  }
  .tagline {
    font-weight: 300;
    margin-bottom: -0.2em;
  }
}
.search-bar-input {
  width: 400px;
  height: 1px;
  font-size: 10px;
  padding: 20px 20px !important;
  margin: 2px;
  border: 0px !important;
  border-radius: 5px !important;
  box-shadow: 0 0 0.4em rgba(0, 0, 0, 0.5);
	outline: none;
}
</style>
<template>
  <header class="navbar-fixed-top hmy-bg">
    <div class="container">
      <div class="navbar-header">
        <div class="site-brand flex-horizontal">
          <router-link class="navbar-brand" to="/" />
          <span class="tagline">Blockchain Explorer</span>
        </div>
        <div class="navbar-actions">
          <div v-if="$route.name !== 'HomePage'" class="search-bar-body">
            <input
              type="text"
              placeholder="Search for Blocks / Transactions / Accounts..."
              class="search-bar-input"
              v-model="textSearchBar"
              @keyup.enter="searchQuery()"
            />
          </div>
          <router-link class="navbar-nav" to="/blocks">
            Blocks
          </router-link>
          <router-link class="navbar-nav" to="/txs">
            Transactions
          </router-link>
          <router-link class="navbar-nav" to="/staking-txs">
            Staking
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import service from '../explorer/service';
import store from '../explorer/store';
export default {
  name: 'SiteHeader',
  data() {
    return {
      textSearchBar: ''
    };
  },
  methods: {
    searchQuery() {
      let input = this.textSearchBar.trim();
      this.textSearchBar = '';
      
      service
        .search(input)
        .then(result => {
          if (result.type === 'block') {
            this.$router.push(`/block/${input}`);
          } else if (result.type === 'tx') {
            this.$router.push(`/tx/${input}`);
          } else if (result.type === 'address') {
            this.$router.push(`/address/${input}`);
          } else {
            alert('invalid search query');
          }
        })
        .catch(r => {
          alert('invalid search query')
        });
    },
  },
};
</script>
