
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
  flex: 1;
}

.explorer-page {
  .hash {
    margin: @space-md 0;
  }
  h1,
  h2 {
    margin: @space-sm 0;
  }

  .explorer-table {
    border-collapse: collapse;
    width: 100%;
    text-align: left;
    margin-bottom: 3em;
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

