<template>
  <router-view/>
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
body {
  height: 100%;
}
</style>
