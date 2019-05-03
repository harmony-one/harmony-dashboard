
<style lang="less">
@import "./less/common.less";

* {
  padding: 0;
  margin: 0;
}

body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: #dfdfdf;
}

html,
body,
.app {
  height: 100%;
}

.app {
  display: flex;
  flex-direction: column;
}

.page {
  flex: 1 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(359deg);
  }
}

.loading-spinner {
  position: relative;
  width: 1em;
  height: 1em;
  display: inline-block;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    margin-top: -50%;
    margin-left: -50%;
    border-radius: 50%;
    border: 0.05em solid #fff;
    border-top-color: var(--color-link);
    animation: spin 0.8s linear infinite;
  }
}
@media (max-width: 768px) {
  .td-title {
    width: auto !important;
  }
}
.explorer-page {
  display: flex;
  flex-direction: column;
  background-color: #191919;
  .explorer-body {
    flex: 1;
  }

  .explorer-card {
    .card();
    background-color: #222;
    color: #ddd;
    // padding: @space-md @space-lg;
    padding: 0;
    header {
      border-bottom: solid 1px #2a2a2a;
      padding: @space-md @space-lg;
      display: block;
    }
    a {
      color: #3b85b6;
      transition: color @anim-duration @anim-easing;
      &:hover {
        color: #4dacea;
        text-decoration: none;
      }
    }
    span.disabled {
      &,
      &:hover {
        color: inherit;
        pointer-events: none;
      }
    }
    h1 {
      font-size: 1.5em;
    }
    h2 {
      font-size: 1.1em;
      margin: @space-sm 0;
    }
    margin-bottom: @space-md;
    section + section {
      margin-top: @space-xxl;
    }
  }
  .explorer-card + .explorer-card {
    margin-top: @space-md;
  }
  .explorer-card-body {
    padding: @space-md @space-lg;
  }
  .explorer-table {
    border-collapse: collapse;
    width: 100%;
    text-align: left;

    .td-title {
      width: 15em;
    }
    .td-title,
    th {
      font-weight: bold;
      color: #777;
      font-size: 0.8em;
    }
    th,
    td {
      padding: @space-sm @space-xs;
    }
    td {
      color: #888;
      transition: all @anim-duration @anim-easing;
      word-break: break-word;

      &.no-break {
        word-break: normal;
      }
    }
    tr:hover td {
      color: #ccc;
      background-color: #282828;
    }
    tr + tr,
    tbody {
      border-top: solid 1px #2a2a2a;
    }
  }

  .btn.btn-light {
    color: #ccc;
    &:disabled {
      color: #2a2a2a !important;
    }
  }
}
</style>
<template>
  <div class="app">
    <site-header/>
    <router-view/>
    <site-footer/>
  </div>
</template>

<script>
import "animate.css/animate.css";
import "flexboxgrid/dist/flexboxgrid.min.css";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
export default {
  name: "App",
  components: {
    SiteFooter,
    SiteHeader
  }
};
</script>

