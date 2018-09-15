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
      data: (function() {
        // init with some null data
        var data = [],
          time = new Date().getTime(),
          i;

        for (i = -300; i <= 0; i += 1) {
          data.push([time + i * 1000, null]);
        }
        return data;
      })()
    }
  ]
};
export default {
  name: "LiveLineChart",
  props: ["value", "title"],
  data() {
    return {
      series: null
    };
  },
  watch: {
    value(val) {
      var x = new Date().getTime();
      this.series.addPoint([x, formatDecimal(val)], true, true);
    }
  },
  mounted() {
    options.title.text = this.title;
    let chart = Highcharts.stockChart("container", options);
    this.series = chart.series[0];
    this.series.name = this.title;
  }
};
</script>