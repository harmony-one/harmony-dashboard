// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueScrollTo from 'vue-scrollto';
import FontAwesome from "@fortawesome/fontawesome";
import FontAwesomeBrands from "@fortawesome/fontawesome-free-brands";
import FaSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import Highcharts from "highcharts";
import HighchartsVue from 'highcharts-vue';
import { formatDecimal, formatNumber } from './util';

FontAwesome.library.add(FontAwesomeBrands, FaSpinner);

Vue.use(VueScrollTo, {
  offset: -68
});

Vue.config.productionTip = false

Vue.filter('decimal', formatDecimal);
Vue.filter('number', formatNumber);

Vue.component('shard-summary', require('./components/ShardSummary.vue').default);
Vue.component('global-summary', require('./components/GlobalSummary.vue').default);
Vue.component('live-line-chart', require('./components/LiveLineChart.vue').default);

Highcharts.setOptions({
  global: {
    useUTC: false
  },
  credits: {
    enabled: false
  }
});
Vue.use(HighchartsVue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})