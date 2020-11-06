<style scoped lang="less">
@import '../less/common.less';

.dropbtn {
  border: none;
  cursor: pointer;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

.chart-header {
  font-size: 15px;
  padding: 10px 0px;
  color: #1b295e;
}
</style>

<template>
  <div class="metrics-summary">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
        <div class="stats-row">
          <div class="flex-horizontal">
            <div class="icon-column">
              <div class="data-icon-circle">
                <div class="data-icon icon-harmony-logo" />
              </div>
            </div>
            <div class="data-num-column">
              <div class="data-num">
                {{ stats.price | currency }}
              </div>
              <h1>ONE Price</h1>
            </div>
          </div>
          <div class="flex-horizontal">
            <div class="icon-column">
              <div class="data-icon-circle">
                <div class="data-icon icon-market-cap" />
              </div>
            </div>
            <div class="data-num-column">
              <div class="data-num">
                {{ stats.marketCap | bigCurrency }}
              </div>
              <h1>Market Cap</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
        <div class="flex-horizontal">
          <div class="icon-column">
            <div class="data-icon-circle">
              <div class="data-icon icon-tx-count" />
            </div>
          </div>
          <div class="data-num-column">
            <div class="data-num">
              {{ stats.volume | bigCurrency }}
            </div>
            <h1>Volume 24H</h1>
          </div>
        </div>
        <div class="flex-horizontal">
          <div class="icon-column">
            <div class="data-icon-circle">
              <div class="data-icon icon-total-supply" />
            </div>
          </div>
          <div class="data-num-column">
            <div class="data-num">
              {{ stats.totalSupply | bigCurrencyOne }}
            </div>
            <h1>Total ONE Supply</h1>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
        <div class="chart-header">
          ONE TRANSACTION HISTORY IN {{ selectedTransactionVolumeTimeframeLabel }}
          <div class="dropdown">
            <button class="dropbtn btn btn-light btn-icon-only">
              <font-awesome-icon icon="chevron-down" />
            </button>
            <div class="dropdown-content">
              <a href="#" @click.prevent="setChartTimeframe(48, '2 DAYS')">2 Days</a>
              <a href="#" @click.prevent="setChartTimeframe(336, '14 DAYS')">14 Days</a>
              <a href="#" @click.prevent="setChartTimeframe(720, '30 DAYS')">30 Days</a>
              <a href="#" @click.prevent="setChartTimeframe(8544, '1 YEAR')">1 Year</a>
              <a href="#" @click.prevent="setChartTimeframe(-1, 'ALL TIME')">All Time</a>
            </div>
          </div>
        </div>
        <div id="Transaction-Volume-Body"></div>
        <div v-if="loadingTransactionVolumeChart">
            <loading-message />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral';
import LoadingMessage from './LoadingMessage';
import service from '../explorer/service';
import Chart from 'chart.js';

numeral.register('locale', 'us', {
  delimiters: {
    thousands: ',',
    decimal: '.',
  },
  abbreviations: {
    thousand: 'K',
    million: 'M',
    billion: 'B',
    trillion: 'T',
  },
  ordinal: function(number) {
    return number === 1 ? 'er' : 'ème';
  },
  currency: {
    symbol: '$',
  },
});

numeral.locale('us');

export default {
  name: 'CoinStats',
  components: {
    LoadingMessage,
  },
  filters: {
    currency: value =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumSignificantDigits: 5,
      }).format(value),
    bigCurrency: value => numeral(value).format('$ 0.00 a'),
    bigCurrencyOne: value => numeral(value).format('0.00 a'),
  },
  props: ['stats'],
  data() {
    return {
      loadingTransactionVolumeChart: true,
      selectedTransactionVolumeTimeframe: '336', // hours
      selectedTransactionVolumeTimeframeLabel: '14 Days',
    };
  },
  computed: {
    stylePriceChanged() {
      return {
        color: this.stats.priceChange1d > 0 ? 'green' : 'red',
      };
    },
  },
  watch: {
    selectedTransactionVolumeTimeframe (){
      this.updateTransactionVolumeChart();
    }
  },
  mounted() {
    this.updateTransactionVolumeChart();
  },
  methods: {
    setChartTimeframe(time, label) {
      this.selectedTransactionVolumeTimeframe = time.toString();
      this.selectedTransactionVolumeTimeframeLabel = label;
    },
    updateTransactionVolumeChart() {
      
      // set loading animation
      this.loadingTransactionVolumeChart = true;

      // remove canvas element
      let chart_canvas_el_rem = document.getElementById("Transaction-Volume-Chart");
      if (chart_canvas_el_rem != null) {
        chart_canvas_el_rem.parentNode.removeChild(chart_canvas_el_rem);
      }

      let min_height = 0;
      let max_height = 0;

      service.getMaxBlockHeightTransactionVolume().then(res => {
        // Get current block height 

        let height = res.data['height']

        let block_range = 0;

        if (this.selectedTransactionVolumeTimeframe !== '-1') {
          // selectedTransactionVolumeTimeframe is selected by hours,
          // convert to seconds
          // then convert to blocks

          block_range = (parseInt(this.selectedTransactionVolumeTimeframe) * 3600) / 5;
        } else {
          // selected all time
          block_range = height;
        }

        min_height = height - block_range;
        max_height = height;

        return service.getTransactionVolume(min_height);
      }).then(res => {
        // Get transaction volume

        // stop loading animation
        this.loadingTransactionVolumeChart = false;

        // add canvas element
        let chart_canvas_el_add = document.createElement("CANVAS");
        chart_canvas_el_add.setAttribute('id', "Transaction-Volume-Chart");
        document.getElementById("Transaction-Volume-Body").appendChild(chart_canvas_el_add);

        let timestamps = res.data;

        let num_bars = 40;
        
        let data = [];
        for (let i = 0; i < num_bars; i ++) {
          data.push(0);
        }

        let labels = [];
        for (let i = 0; i < num_bars; i ++) {
          if (i == 0 || i == 19 || i == 39) {
            let time_selected = parseInt(this.selectedTransactionVolumeTimeframe);
            if (time_selected == -1) {
              // Selected all time
              // HARDCODED
              // Timestamp of first block in shard 0 is        1561736306
              time_selected = (Math.floor(Date.now() / 1000) - 1561736306);

              // convert seconds to hours
              time_selected = Math.floor(time_selected / 3600);
            }

            let ts = Math.round(new Date().getTime() / 1000);
            let hoursAgo = time_selected - Math.floor((i * time_selected) / num_bars); 
            let dateAgo = new Date((ts - (hoursAgo * 3600)) * 1000);
            
            if (time_selected == 24) {
              // hour labels
              let h = dateAgo.getHours();
              let m = '00';
              let AMPM = (h >= 12)? " PM":" AM";

              if (h > 12) h = h - 12;
              if (h < 1) h = h + 12;

              labels.push(h + ':' + m + AMPM);
            } else {
              // date labels
              let m = dateAgo.getMonth();
              let d = dateAgo.getDate();

              // only show year when selected All Time
              let y = (this.selectedTransactionVolumeTimeframe == '-1') ?
                (' ' + dateAgo.getFullYear()) : '';

              m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m];

              labels.push(m + " '" + d + y);
            }
          } else {
            labels.push('');
          }
        }

        let backgroundColor = [];
        for (let i = 0; i < num_bars; i ++) {
          backgroundColor.push('rgba(0, 174, 233, 0.2)');
        }

        let borderColor = [];
        for (let i = 0; i < num_bars; i ++) {
          backgroundColor.push('rgba(0, 174, 233, 1)');
        }

        for (let i = 0; i < timestamps.length; i++) {
          let height = timestamps[i]['Block_height'];
          let tx_count = timestamps[i]['Tx_count'];
          if (height >= max_height) {
            data[num_bars - 1] += tx_count;
            continue;
          }

          let index = Math.floor(((height - min_height) / (max_height - min_height)) * data.length);

          data[index] += tx_count;
        }

        // Render transaction volume
        const ctx = document.getElementById('Transaction-Volume-Chart');
        ctx.height = 110;
        const myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            showTooltips: false,
            datasets: [
              {
                label: '',
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
              },
            ],
          },
          options: {
            animation: {
              duration: 0,
            },
            legend: {
              display: false,
            },
            scales: {
              xAxes: [
                {
                  gridLines: {
                    display:false
                  },
                  scaleLabel: {
                    display: false
                  },
                  ticks: {
                    maxRotation: 0,
                    minRotation: 0
                  },
                },
              ],
              yAxes: [
                {
                  gridLines: {
                    display:false
                  },
                  scaleLabel: {
                    display: false,
                  },
                  ticks: {
                    max: Math.max(...data),
                    beginAtZero: true,
                    autoSkip: true,
                    maxTicksLimit: 2,
                  },
                },
              ],
            },
          },
        });

      });

      return;
    },
  },
};
</script>
