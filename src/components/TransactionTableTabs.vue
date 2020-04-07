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
    color: #1b295e;
    margin-right: 20px;
    font-size: 1.1em;
    font-weight: 500;

    &.active {
      color: var(--color-table-link);
      position: relative;
      display: inline-block;

      &:after {
        display: block;
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        background-color: var(--color-table-link);
        bottom: -17px;
      }
    }
  }
}
</style>
