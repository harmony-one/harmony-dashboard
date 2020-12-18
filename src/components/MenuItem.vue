<template>
  <div class="menu-item" @click="clickMenu" v-click-outside="hideMenu">
    {{text}}
    <font-awesome-icon icon="chevron-down" />
    <section class="sub-menu" v-if="showMenu">
      <slot/>
    </section>
  </div>
</template>
<script>
export default {
  props: ['text'],
  data: () => ({
    showMenu: false,
  }),
  methods: {
    clickMenu() {
      this.showMenu = !this.showMenu
    },
    hideMenu() {
      this.showMenu = false
    },
  },
}
</script>
<style lang="less" scoped>
.menu-item {
  cursor: pointer;
  position: relative;
  .sub-menu {
    position: absolute;
    white-space: nowrap;
    background: #fffffff0;
    border: 1px solid #f4f4f4;
    color: var(--bright-text-color);
    font-size: 0.8rem;
    div {
      padding: 10px 1rem;
      &:hover {
        color: var(--color-link);
      }
    }
  }
}
</style>