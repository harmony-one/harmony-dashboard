<style lang="less">
@import './less/common.less';

* {
  padding: 0;
  margin: 0;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
    content: '';
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
  background-color: #f7f7ff;
  .explorer-body {
    flex: 1;
    padding-top: 8em;
    width: 100%;
    color: var(--primary-text-color);
    display: flex;
  }

  .explorer-card {
    .card();
    background-color: var(--color-card-background);
    color: var(--color-table-text);
    padding: 0;
    box-shadow: 0 0 0.4em rgba(0, 0, 0, 0.1);
    header,
    footer {
      padding: @space-md @space-lg;
      display: block;
    }
    header {
      border-bottom: solid 1px var(--color-table-border);
    }
    header {
      .flex-horizontal;
      align-items: flex-end;
      .pagination-controls {
        .flex-horizontal;
        text-align: right;
        float: right;
        font-size: 0.8em;
        .total-tx-num {
          margin-right: @space-md;
        }
        .pagination-nums {
          margin-left: @space-md;
        }
      }
    }

    footer {
      border-top: solid 1px var(--color-table-border);
      &.button-only-footer {
        padding: 0;
        .btn {
          padding: @space-md;
        }
      }
    }
    a {
      color: var(--color-table-link);
      transition: color @anim-duration @anim-easing;
      &:hover {
        color: var(--color-table-link-hover);
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
      font-size: 1.3em;
      color: #1b295e;
      font-weight: 500;
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
      color: var(--color-table-text-hover);
      background-color: var(--color-table-background-hover);
    }
    tr + tr,
    tbody {
      border-top: solid 1px var(--color-table-border);
    }
  }

  .btn.btn-light {
    color: var(--color-button-light-text);
    &:disabled {
      opacity: 0.5;
    }
  }
}

.explorer-card.status-card {
  .icon-column {
    padding: 0 @space-md;
    height: 100%;
    .flex-hv-center();
  }
  .data-num-column {
    padding: @space-md;
    .data-num {
      font-size: 2em;
      color: #1b295e;
    }
    h1 {
      font-size: 1em;
      font-weight: normal;
    }
  }
  .data-icon-circle {
    width: 2em;
    height: 2em;
    .hmy-bg();
    border-radius: 100%;

    .data-icon {
      width: 100%;
      height: 100%;
      background-size: 60% 60%;
      background-repeat: no-repeat;
      background-position: center;
      &.icon-block-count {
        background-image: url(assets/block-count.svg);
      }
      &.icon-tx-count {
        background-image: url(assets/tx-count.svg);
      }
      &.icon-node-count {
        background-image: url(assets/node-count.svg);
      }
      &.icon-shard-count {
        background-image: url(assets/shard-count.svg);
      }
    }
  }
}

.explorer-card.status-card.status-shard {
  .data-num-column {
    .data-shard {
      font-size: 1.3em;
      font-weight: 500;
    }
  }
  .row {
    margin-left: 5em;
  }
  .data-slot {
    margin-top: 1.3em;
    /*border-bottom: solid 1px var(--color-table-border);*/

    .data {
      font-size: 1.2em;
      color: black;
    }
    .link {
      font-size: 1.2em;
    }
    .sub-title {
      font-size: 1.1em;
      color: #888;
    }
  }
}

.explorer-table-responsive {
  display: table;
  width: 100%;
  border-collapse: collapse;
  .th,
  .td {
    padding: @space-sm @space-xs;
    display: table-cell;
    text-align: left;
  }
  .tr {
    display: table-row;
  }
  .th {
    font-weight: bold;
    color: #777;
    font-size: 0.8em;
  }

  .td {
    color: var(--color-table-text);
    transition: all @anim-duration @anim-easing;
    word-break: break-word;
  }
  .tr:hover .td {
    color: var(--color-table-text-hover);
    background-color: var(--color-table-background-hover);
  }
  .tr + .tr {
    border-top: solid 1px var(--color-table-border);
  }
}

.timer {
  color: #666;
}
.secondary-info {
  font-size: 0.8em;
}
</style>
<template>
  <div class="app">
    <site-header />
    <router-view />
    <site-footer />
  </div>
</template>

<script>
import 'animate.css/animate.css'
import 'flexboxgrid/dist/flexboxgrid.min.css'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'

export default {
  name: 'App',
  components: {
    SiteFooter,
    SiteHeader,
  },
}
</script>
