<style scoped lang="less">
@import "../less/common.less";
</style>

<template>
  <div class="container">
    <div id="container" style="height: 400px; min-width: 310px"></div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
import stockInit from "highcharts/modules/stock";
stockInit(Highcharts);

let options = {
  chart: {
    events: {
      load: function() {
        // set up the updating of the chart each second
        var series = this.series[0];
        setInterval(function() {
          var x = new Date().getTime(), // current time
            y = Math.round(Math.random() * 100);
          series.addPoint([x, y], true, true);
        }, 1000);
      }
    }
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
    text: "Live random data"
  },

  series: [
    {
      name: "Random data",
      data: (function() {
        // generate an array of random data
        var data = [],
          time = new Date().getTime(),
          i;

        for (i = -999; i <= 0; i += 1) {
          data.push([time + i * 1000, Math.round(Math.random() * 100)]);
        }
        return data;
      })()
    }
  ]
};
export default {
  name: "LiveLineChart",
  mounted() {
    Highcharts.stockChart("container", options);
  }
};
</script>