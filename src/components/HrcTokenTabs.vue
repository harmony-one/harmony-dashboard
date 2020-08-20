<template>
  <div class="transactions-table explorer-card">
    <header>
      <select
        v-if="type == 'select'"
        class="optionItem"
        @change="event => selectTab(event.target.selectedIndex)"
      >
        <option v-for="(name, index) in tabNames" :key="index" :value="name">
          {{ name }}
        </option>
      </select>
      <div v-else class="tabs">
        <span
          v-for="(name, index) in tabNames"
          :key="index"
          :class="{ tabItem: true, active: selected == name }"
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
  props: ['value', 'onChange', 'titlePrefix', 'type'],
  data() {
    return {
      tabNames: [],
      selected: null,
    }
  },
  watch: {
    value() {
      this.selected = this.value
    },
  },
  mounted() {
    this.tabNames = this.getTabs()
    if (!this.value && this.tabNames.length) this.selectTab(0)
    //else this.selected = this.value;
  },
  methods: {
    selectTab(index) {
      this.selected = this.tabNames[index]
      if (this.value != undefined) this.$emit('change', this.selected)
    },
    getTabs() {
      // return this.$children.filter(item => item.$options.name === 'TabPane');
      const AllTabPanes = this.findComponents('TabPane')
      return AllTabPanes.map(e => e.$props.name)
    },
    findComponents(componentName) {
      return this.$children.filter(
        child => child.$options.name === componentName
      )
    },
  },
}
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
    }
  }
}

.optionItem {
  border: none;
  padding: 0;
  cursor: pointer;
  color: #1b295e;
  font-size: 1.1em;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 500;
}
.optionItem:focus {
  box-shadow: none !important;
}
</style>
