<style scoped lang="less">
@import '../less/common.less';

.admin-page {
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

      input[type='password'] {
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
</style>

<template>
  <div class="admin-page page">
    <header class="navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <router-link class="navbar-brand" to="/" />
        </div>
      </div>
    </header>

    <div class="admin-body">
      <div class="container flex-hv-center">
        <div class="card admin-card">
          <header>Reset Dashboard</header>
          <label>
            Secret:
            <input v-model="secret" type="password" />
          </label>
          <button class="btn btn-primary" @click="reset">
            Reset
          </button>
        </div>
      </div>
    </div>

    <site-footer />
  </div>
</template>

<script>
import DashboardService from '../dashboard/service'
import ExplorerService from '../explorer/service'
import SiteFooter from './SiteFooter'

export default {
  name: 'AdminPage',
  components: {
    SiteFooter,
  },
  data() {
    return {
      secret: '',
    }
  },
  mounted() {},
  methods: {
    reset() {
      Promise.all([
        DashboardService.reset(this.secret),
        ExplorerService.reset(this.secret),
      ]).then(
        () => {
          alert('Reset Successful!')
        },
        () => {
          alert('Reset Failed!')
        }
      )
    },
  },
}
</script>
