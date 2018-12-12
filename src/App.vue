
<style lang="less">
@import "./less/common.less";

* {
  padding: 0;
  margin: 0;
}

body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
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

