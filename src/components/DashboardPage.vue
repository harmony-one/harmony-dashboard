<style scoped lang="less">
@import '../less/common.less';

.dashboard-page {
  display: flex;
  flex-direction: column;
}

.dashboard-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;

  > .container {
    padding-top: 6em;
    padding-bottom: 1em;

    .placeholder-text {
      color: var(--secondary-text-color);
      font-size: 3em;
    }
  }
}
</style>

<template>
  <div class="dashboard-page page">
    <div class="dashboard-body">
      <div
        class="container"
        v-if="Object.keys(globalData.shardSummaries).length"
      >
        <global-summary :summary="globalData.globalSummary"></global-summary>
        <shard-summary
          :summary="summary"
          v-for="(summary, key) in globalData.shardSummaries"
          :key="key"
        ></shard-summary>
      </div>
      <div class="container flex-hv-center" v-else>
        <div class="placeholder-text">No Data</div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../dashboard/store';

export default {
  name: 'DashboardPage',
  data() {
    return {
      globalData: store.data
    };
  },
  mounted() {}
};
</script>
