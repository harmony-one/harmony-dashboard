<style scoped lang="less">
@import '../less/common.less';

.loading-message {
  font-size: 2em;
  text-align: center;
  height: 100%;
  .loading-spinner {
    font-size: 2em;
  }
  .loading-message-text {
    margin-top: @space-sm;
    font-variant: small-caps;
  }
}
</style>
<template>
  <div class="loading-message flex-hv-center">
    <div>
      <i class="loading-spinner" />
      <div class="loading-message-text">
        Loading...
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingMessage',
}
</script>
