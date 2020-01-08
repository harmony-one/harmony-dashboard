import moment from "moment";
import Vue from "vue";

/**
 * Ref:
 * * https://momentjs.com/docs/#/customization/relative-time-threshold/
 * * https://momentjs.com/docs/#/displaying/fromnow/
 */
moment.relativeTimeThreshold("ss", 0);

export function formatDecimal(number) {
  return formatNumber((+number).toFixed(2));
}

export function formatNumber(number) {
  return (+number).toLocaleString();
}

export function shortenHash(hash) {
  if (!hash || hash.length <= 10) return hash;
  return hash.substr(0, 5) + "..." + hash.substr(hash.length - 5);
}

export function formatTimestamp(timestamp) {
  return moment(timestamp).format("MM/DD/YYYY hh:mm:ss");
}

export function formatAge(timestamp) {
  return moment(timestamp).fromNow();
}

export function formatAmount(amount) {
  return Number(amount) / 10 ** 18;
}

export function formatBlockLatency(time) {
  if (!time) {
    return "-";
  }

  return formatDecimal(time / 10 ** 3) + "s";
}

Vue.filter("decimal", formatDecimal);
Vue.filter("number", formatNumber);
Vue.filter("shorten", shortenHash);
Vue.filter("timestamp", formatTimestamp);
Vue.filter("age", formatAge);
Vue.filter("amount", formatAmount);
Vue.filter("blockLatency", formatBlockLatency);
