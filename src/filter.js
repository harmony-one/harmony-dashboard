import moment from "moment";
import Vue from 'vue';

export function formatDecimal(number) {
    return formatNumber((+number).toFixed(2));
}

export function formatNumber(number) {
    return (+number).toLocaleString()
}

export function shortenHash(hash) {
    if (!hash || hash.length <= 10) return hash;
    return hash.substr(0, 5) + "..." + hash.substr(hash.length - 5);
}

export function formatTimestamp(timestamp) {
    return moment(timestamp).format('MM/DD/YYYY hh:mm:ss');
}

Vue.filter('decimal', formatDecimal);
Vue.filter('number', formatNumber);
Vue.filter('shorten', shortenHash);
Vue.filter('timestamp', formatTimestamp);
