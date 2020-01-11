<template>
  <div class="vue-expand-panel">
    <div class="item-container">
      <div class="content" :class="{ 'content-height': openBar === true }">
        <slot></slot>
      </div>
      <div
        class="index-bar"
        @click="clickBar()"
        :class="{ 'index-bar-border-radius': openBar === true }"
      >
        <div class="left-index">{{ !openBar ? "Show more" : "Hide" }}</div>
        <div class="right-arrow">
          <div
            class="arrow"
            :class="{ 'rolling-in-the-deep': openBar === true }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "expand-panel",
  props: {
    title: String
  },
  data() {
    return {
      openBar: false
    };
  },
  methods: {
    clickBar() {
      const currentOpenBar = this.openBar;
      this.openBar = !currentOpenBar;
    }
  }
};
</script>

<style lang="less">
.vue-expand-panel {
  width: 100%;

  .item-container {
    width: 100%;

    .index-bar-border-radius {
      border-radius: 4px 4px 0 0 !important;
    }
    .index-bar {
      width: 100%;
      cursor: pointer;
      height: 32px;
      line-height: 32px;
      display: flex;
      flex-flow: row;
      justify-content: space-between;
      transition: border-radius 0.3s ease-in-out;
      .left-index {
        font-size: 14px;
        margin-left: 3px;
        color: var(--color-table-link);
      }
      .right-arrow {
        height: 100%;
        width: 24px;
        div.rolling-in-the-deep {
          transform: rotate(-180deg);
        }
        div.arrow {
          transition: transform 0.3s ease-out;
          display: inline-block;
          position: relative;
          height: 100%;
          width: 100%;
        }
        div.arrow::after {
          display: inline-block;
          content: " ";
          margin-left: 6px;
          height: 6px;
          width: 6px;
          border-width: 0 2px 2px 0;
          border-color: #4f4f4f;
          border-style: solid;
          transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
          transform-origin: center;
          transition: transform 0.3s;
        }
      }
    }
    .content-height {
      max-height: 200px !important;
    }
    .content {
      width: 100%;
      max-height: 0;
      overflow: hidden;
      transition: all 0.3s ease-in-out;
    }
  }
}
</style>
