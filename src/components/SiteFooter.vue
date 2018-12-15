<style scoped lang="less">
@import "../less/common.less";
footer {
  padding-bottom: @space-lg;
  // background: linear-gradient(0deg, #262627 0, #525254 100%);
  background-color: #262627;
  color: #a09ea7;
  .container {
    text-align: center;
    padding: @space-md 0;
  }
  .community {
    .svg-inline--fa {
      font-size: 1.5em;
      margin: 0.5em;
      cursor: pointer;
    }
  }

  a {
    color: inherit;
    transition: color @anim-duration @anim-easing;

    &:hover {
      color: var(--bright-text-color);
    }
  }

  .links {
    font-size: 0.8em;
  }

  .copyright {
    font-size: 0.6em;
    color: #868390;
  }
}
</style>
<template>
  <footer>
    <div class="community container">
      <a href="https://medium.com/harmony-one" target="_blank">
        <font-awesome-icon :icon="['fab', 'medium']"/>
      </a>
      
      <a href="https://twitter.com/harmonyprotocol" target="_blank">
        <font-awesome-icon :icon="['fab', 'twitter']"/>
      </a>
      
      <a href="https://www.instagram.com/harmony.protocol/" target="_blank">
        <font-awesome-icon :icon="['fab', 'instagram']"/>
      </a>
      
      <a href="https://t.me/harmony_one" target="_blank">
        <font-awesome-icon :icon="['fab', 'telegram']"/>
      </a>
    </div>
    <div class="links container">
      <a href="#" target="_blank">Terms of Use</a>
      |
      <a href="#" target="_blank">Privacy Policy</a>
    </div>
    <div class="copyright container">Copyright © 2018 harmony | All rights reserved</div>
  </footer>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
export default {
  name: "SiteFooter",
  components: {
    FontAwesomeIcon
  }
};
</script>