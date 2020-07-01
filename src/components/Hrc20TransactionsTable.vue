<style scoped lang="less">
@import '../less/common.less';
.wfont {
  font-family: monospace, 'Courier New', Courier;
  font-size: 16px;
}
</style>

<template>
  <div class="transactions-table explorer-card">
    <header>
      <slot />
      <div class="pagination-controls">
        <span class="total-tx-num">{{ txCount }} txs</span>
        <span class="page-controllers">
          <span class="page-navigator">
            <button
              class="btn btn-light btn-icon-only"
              :disabled="pageIndex === 0"
              @click="first()"
            >
              <font-awesome-icon icon="angle-double-left" />
            </button>
            <button
              class="btn btn-light btn-icon-only"
              :disabled="pageIndex === 0"
              @click="prev()"
            >
              <font-awesome-icon icon="chevron-left" />
            </button>
            <span class="pagination-nums">
              {{ pageIndex + 1 }} / {{ pageCount }}
            </span>
            <button
              class="btn btn-light btn-icon-only"
              :disabled="pageIndex === pageCount - 1"
              @click="next()"
            >
              <font-awesome-icon icon="chevron-right" />
            </button>
            <button
              class="btn btn-light btn-icon-only"
              :disabled="pageIndex === pageCount - 1"
              @click="last()"
            >
              <font-awesome-icon icon="angle-double-right" />
            </button>
          </span>
        </span>
      </div>
    </header>
    <div class="explorer-card-body">
      <section>
        <table class="explorer-table">
          <tr>
            <th>TxHash</th>
            <th>Timestamp</th>
            <th>From</th>
            <th>To</th>
            <th>Data Decode</th>
          </tr>
          <tr
            v-for="tx in txs.filter(tx => tx.input != '0x')"
            :key="tx.hash"
          >
            <td style="width:8em">
              <router-link :to="'/tx/' + tx.hash">
                {{ tx.hash | shorten }}
              </router-link>
            </td>
            <td style="width:13em">
              {{ (Number(tx.timestamp) * 1000) | timestamp }}
            </td>
            <td style="width:8em">
              <router-link :to="'/address/' + tx.from">
                {{ tx.from | shorten }}
              </router-link>
            </td>
            <td style="width:8em">
              <Address :bech32="tx.to" />
            </td>
            <td class="no-break wfont">
              <DecodeABI
                :abi="$store.data.HRC20_ABI"
                :data="tx.input"
                :is-hrc20="isHrc20(tx.hash)"
              />
            </td>
          </tr>
        </table>
      </section>
    </div>
  </div>
</template>

<script>
import Address from './Address';
import DecodeABI from './DecodeABI';
export default {
  name: 'TransactionsTable',
  components: { Address, DecodeABI },
  props: ['allTxs', 'withShards', 'page', 'changePage'],
  data() {
    return {
      loading: true,
      pageIndex: this.page || 0,
      pageSize: 20,
    };
  },
  computed: {
    txCount() {
      return this.allTxs.length;
    },
    pageCount() {
      return Math.ceil(this.txCount / this.pageSize);
    },
    txs() {
      const begin = this.pageIndex * this.pageSize;

      return this.allTxs.slice(begin, begin + this.pageSize);
    },
  },
  watch: {
    allTxs() {
      this.pageIndex = 0;
    },
  },
  methods: {
    goToPage(index) {
      if (index < 0) index = 0;
      if (index >= this.pageCount) index = this.pageCount - 1;

      this.pageIndex = index;

      if (this.changePage) {
        this.changePage(index);
      }
    },
    first() {
      this.goToPage(0);
    },
    last() {
      this.goToPage(this.pageCount - 1);
    },
    prev() {
      if (this.pageIndex === 0) return;
      this.goToPage(this.pageIndex - 1);
    },
    next() {
      if (this.pageIndex === this.pageCount - 1) return;
      this.goToPage(this.pageIndex + 1);
    },
    isHrc20(address) {
      return this.$store.data.Hrc20Address[address] != undefined;
    },
  },
};
</script>
