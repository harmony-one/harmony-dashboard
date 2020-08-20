<style scoped lang="less">
@import '../less/common.less';
footer {
  padding-bottom: @space-lg;
  background-color: #fff;
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
      <a href="http://harmony.one/team" target="_blank">
        <font-awesome-icon :icon="['fas', 'user-friends']" />
      </a>

      <a href="https://medium.com/harmony-one" target="_blank">
        <font-awesome-icon :icon="['fab', 'medium']" />
      </a>

      <a href="https://twitter.com/harmonyprotocol" target="_blank">
        <font-awesome-icon :icon="['fab', 'twitter']" />
      </a>

      <a href="https://t.me/harmony_one" target="_blank">
        <font-awesome-icon :icon="['fab', 'telegram']" />
      </a>
    </div>
    <div class="links container">
      <a href="#" target="_blank">Terms of Use</a>
      |
      <a href="#" target="_blank">Privacy Policy</a>
    </div>
    <div class="copyright container">
      Copyright © 2020 Harmony | All Rights Reserved
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SiteFooter',
}
</script>
