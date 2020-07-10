<template>
  <div class="tabs">
    <span
      :class="{ tabItem: true, active: !value }"
      @click="() => onChange(false)"
    >
      <span v-if="titlePostfixTx" class="postfix">{{
        titlePostfixTx | number
      }}</span>
      {{ titlePrefix }} Transactions
    </span>
    <span
      :class="{ tabItem: true, active: value }"
      @click="() => onChange(true)"
    >
      <span v-if="titlePostfixStakingTx" class="postfix">{{
        titlePostfixStakingTx | number
      }}</span>
      {{ titlePrefix }} Staking transactions
    </span>
  </div>
</template>

<script>
export default {
  name: 'TransactionTableTabs',
  props: [
    'value',
    'onChange',
    'titlePrefix',
    'titlePostfixTx',
    'titlePostfixStakingTx',
  ],
};
</script>

<style lang="less">
.tabs {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  .tabItem {
    cursor: pointer;
    color: rgba(85, 91, 104, 0.7);
    font-size: 1.1em;
    font-weight: 500;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    margin-right: 30px;

    .postfix {
      // font-size: 0.8em;
      font-weight: 400;
      display: block;
      margin-right: 6px;
    }

    &.active {
      position: relative;
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
