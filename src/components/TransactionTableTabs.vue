<template>
  <div class="tabs">
    <span
      :class="{ tabItem: true, active: !value }"
      @click="() => onChange(false)"
    >
      Transactions
    </span>
    <span
      :class="{ tabItem: true, active: value }"
      @click="() => onChange(true)"
    >
      Staking transactions
    </span>
  </div>
</template>

<script>
export default {
  name: 'TransactionTableTabs',
  props: ['value', 'onChange'],
};
</script>

<style lang="less">
.tabs {
  flex-grow: 1;
  flex-direction: row;
  justify-content: flex-start;

  .tabItem {
    cursor: pointer;
    color: var(--color-table-link);
    margin-right: 20px;
    order: 1;

    &.active {
      font-size: 1em;
      color: #1b295e;
      font-weight: 500;
      order: 0;
    }
  }
}
</style>
