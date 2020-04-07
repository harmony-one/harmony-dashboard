<template>
  <div class="tabs">
    <span
      :class="{ tabItem: true, active: !value }"
      @click="() => onChange(false)"
    >
      {{ titlePrefix }} Transactions
    </span>
    <span
      :class="{ tabItem: true, active: value }"
      @click="() => onChange(true)"
    >
      {{ titlePrefix }} Staking transactions
    </span>
  </div>
</template>

<script>
export default {
  name: 'TransactionTableTabs',
  props: ['value', 'onChange', 'titlePrefix'],
};
</script>

<style lang="less">
.tabs {
  flex-grow: 1;
  flex-direction: row;
  justify-content: flex-start;

  .tabItem {
    cursor: pointer;
    color: rgba(85, 91, 104, 0.7);
    margin-right: 20px;
    font-size: 1.1em;
    font-weight: 500;

    &.active {
      position: relative;
      display: inline-block;
      color: #1b295e;
      // color: var(--color-table-link);

      &:after {
        display: none;
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        background-color: var(--color-table-link);
        // background-color: #1b295e;
        opacity: 0.8;
        border-radius: 10px;
        bottom: -17px;
      }
    }
  }
}
</style>
