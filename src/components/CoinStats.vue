<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="metrics-summary">
    <div class="justify-between">
      <h1 class="flex-grow stats-title">
        Coin Stats
      </h1>
      <div class="timer">
        Updated {{ Math.round((now - this.stats.updateTime) / 1000) | number }}s
        ago...
      </div>
    </div>

    <div class="row">
      <div
        class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3"
      >
        <div class="dashboard-card">
          <div class="card-title">
            Price
          </div>
          <div class="justify-between">
            <div class="card-value currency">
              {{ stats.price | currency }}
            </div>
            <div class="card-value" :style="stylePriceChanged">
              {{ stats.priceChange1d + '%' }}
            </div>
          </div>
        </div>
      </div>

      <div
        class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3"
      >
        <div class="dashboard-card">
          <div class="card-title">
            Volume 24H
          </div>
          <div class="card-value currency">
            {{ stats.volume | bigCurrency }}
          </div>
        </div>
      </div>

      <div
        class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3"
      >
        <div class="dashboard-card">
          <div class="card-title">
            Market Cap
          </div>
          <div class="card-value currency">
            {{ stats.marketCap | bigCurrency }}
          </div>
        </div>
      </div>

      <div
        class="col-xs-12
            col-sm-6
            col-md-3
            col-lg-3"
      >
        <div class="dashboard-card">
          <div class="card-title">
            Total Supply ONEs
          </div>
          <div class="card-value currency">
            {{ stats.totalSupply | bigCurrencyOne }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'

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
    return number === 1 ? 'er' : 'ème'
  },
  currency: {
    symbol: '$',
  },
})

numeral.locale('us')

export default {
  name: 'CoinStats',
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
      timer: null,
      now: Date.now(),
    }
  },
  computed: {
    stylePriceChanged() {
      return {
        color: this.stats.priceChange1d > 0 ? 'green' : 'red',
      }
    },
  },
  watch: {
    stats() {
      this.resetTimer()
    },
  },
  mounted() {
    this.resetTimer()
  },
  methods: {
    resetTimer() {
      clearInterval(this.timer)
      this.now = Date.now()
      this.timer = setInterval(() => {
        this.now = Date.now()
      }, 1000)
    },
  },
}
</script>
