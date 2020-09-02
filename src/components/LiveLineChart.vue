<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div id="container" />
</template>

<script>
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
stockInit(Highcharts)

export default {
  name: 'LiveLineChart',
  props: ['value', 'title', 'data'],
  data() {
    return {
      series: null,
    }
  },
  watch: {
    value(val) {
      this.series.addPoint(
        [Date.now(), val], // TODO(ricl): this Date.now() should be updateTime
        true, // do redraw
        false // don't shift out points
      )
    },
  },
  mounted() {
    let options = {
      chart: {
        type: 'spline',
      },

      rangeSelector: {
        buttons: [
          {
            count: 1,
            type: 'minute',
            text: '1M',
          },
          {
            count: 5,
            type: 'minute',
            text: '5M',
          },
          {
            type: 'all',
            text: 'All',
          },
        ],
        inputEnabled: false,
        selected: 2,
      },

      title: {
        text: this.title,
      },

      plotOptions: {
        series: {
          marker: {
            enabled: true,
          },
        },
      },

      series: [
        {
          name: this.title,
          data: this.data,
        },
      ],

      tooltip: {
        valueDecimals: 2,
      },
    }
    let chart = Highcharts.stockChart('container', options)
    this.series = chart.series[0]
  },
}
</script>
