<style scoped lang="less">
@import "../less/common.less";
</style>

<template>
  <div id="container"></div>
</template>

<script>
import Highcharts from "highcharts";
import stockInit from "highcharts/modules/stock";
import { formatDecimal } from "../util";
stockInit(Highcharts);

let options = {
  chart: {
    type: "spline"
  },

  rangeSelector: {
    buttons: [
      {
        count: 1,
        type: "minute",
        text: "1M"
      },
      {
        count: 5,
        type: "minute",
        text: "5M"
      },
      {
        type: "all",
        text: "All"
      }
    ],
    inputEnabled: false,
    selected: 0
  },

  title: {
    text: "Live Line Chart"
  },

  plotOptions: {
    series: {
      marker: {
        enabled: true
      }
    }
  },

  series: [
    {
      name: "",
      data: []
    }
  ],

  tooltip: {
    valueDecimals: 2
  }
};
export default {
  name: "LiveLineChart",
  props: ["value", "title", "data"],
  data() {
    return {
      series: null
    };
  },
  watch: {
    value(val) {
      this.series.addPoint(
        [Date.now(), val], // TODO(ricl): this Date.now() should be updateTime
        true, // do redraw
        false // don't shift out points
      );
    }
  },
  mounted() {
    options.title.text = this.title;
    options.series[0].data = (history => {
      const now = Date.now();
      const MIN_SECOND = 300;
      const count = history.length;
      let minute = (now - history[0][0]) / 1000;
      if (minute > MIN_SECOND) {
        return history;
      } else {
        // pad a null at the beginning to make sure all the time selectors are clickable.
        return [[now - MIN_SECOND * 1000, null], ...history];
      }
    })(this.data);
    let chart = Highcharts.stockChart("container", options);
    this.series = chart.series[0];
    this.series.name = this.title;
  }
};
</script>