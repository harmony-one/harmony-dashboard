
<style lang="less">
@import "./less/common.less";

* {
  padding: 0;
  margin: 0;
}

body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: #dfdfdf;
}

html,
body,
.app {
  height: 100%;
}

.app {
  display: flex;
  flex-direction: column;
}

.page {
  flex: 1 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(359deg);
  }
}

.loading-spinner {
  position: relative;
  width: 1em;
  height: 1em;
  display: inline-block;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    margin-top: -50%;
    margin-left: -50%;
    border-radius: 50%;
    border: 0.05em solid #fff;
    border-top-color: var(--color-link);
    animation: spin 0.8s linear infinite;
  }
}

.explorer-page {
  display: flex;
  flex-direction: column;
  .explorer-body {
    flex: 1;
  }

  .explorer-card {
    .card();
    padding: @space-md @space-lg;
    h1 {
      margin-bottom: @space-sm;
      font-size: 1.5em;
    }
    h2 {
      font-size: 1.3em;
      margin: @space-sm 0;
    }
    margin-bottom: @space-md;
    section + section {
      margin-top: @space-lg;
    }
  }
  .explorer-table {
    border-collapse: collapse;
    width: 100%;
    text-align: left;
    .td-title {
      font-weight: bold;
    }
    th,
    td {
      padding: @space-sm;
      border-top: solid 1px var(--color-border);
    }
    th {
      border-bottom: solid 1px var(--color-border);
    }
  }
}
</style>
<template>
  <div class="app">
    <site-header/>
    <router-view/>
    <site-footer/>
  </div>
</template>

<script>
import "animate.css/animate.css";
import "flexboxgrid/dist/flexboxgrid.min.css";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
export default {
  name: "App",
  components: {
    SiteFooter,
    SiteHeader
  }
};
</script>

