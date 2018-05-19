<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

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
#app,
.page {
  height: 100%;
  overflow: auto;
}
</style>
