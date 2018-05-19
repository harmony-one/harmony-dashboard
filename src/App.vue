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

<style>
* {
  padding: 0;
  margin: 0;
}

body {
  font-family: "Microsoft Yahei", sans-serif;
}

:root {
  --bright-text-color: #fff;
  --primary-button-background-color: #0a93eb;
  --primary-button-hover-background-color: #0987d7;
  --primary-text-color: #4d4b5a;
  --secondary-text-color: #67656f;
}
</style>
