<template>
  <div class="transactions-table explorer-card">
    <header>
      <div class="tabs">
        <span
          v-for="(name, index) in tabNames"
          :key="index"
          :class="{ tabItem: true, active: value == name }"
          @click="selectTab(index)"
        >
          {{ name }}
        </span>
      </div>
    </header>
    <div class="explorer-card-body">
      <section>
        <slot />
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HrcTokenTabs',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: ['value', 'onChange', 'titlePrefix'],
  data() {
    return {
      tabNames: [],
    };
  },
  mounted() {
    this.tabNames = this.getTabs();
    if (!this.value && this.tabNames.length) this.selectTab(0);
  },
  methods: {
    selectTab(index) {
      this.$emit('change', this.tabNames[index]);
    },
    getTabs() {
      // return this.$children.filter(item => item.$options.name === 'TabPane');
      const AllTabPanes = this.findComponents('TabPane');
      return AllTabPanes.map(e => e.$props.name);
    },
    findComponents(componentName) {
      return this.$children.filter(
        child => child.$options.name === componentName
      );
    },
  },
};
</script>

<style scoped lang="less">
@import '../less/common.less';
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
