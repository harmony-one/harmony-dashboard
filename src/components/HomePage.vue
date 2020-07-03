<style scoped lang="less">
@import '../less/common.less';
.shard {
  width: 25%;
  display: inline-block;

  td {
    word-break: unset;
  }

  .td-title {
    width: 11em;
  }

  .explorer-card-body {
    min-height: auto;
    padding-right: 0;
  }
}

.explorer-card-body {
  min-height: 24em;
  box-sizing: content-box;
}

.home-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;
  header {
    .flex-horizontal;
    align-items: flex-end;
  }

  .latest-block-card {
    table {
      th {
        position: sticky;
        top: 0;
        background-color: var(--color-card-background);
      }
      height: 20em;
      overflow: auto;
    }
  }
}
</style>

<template>
  <div class="home-page explorer-page page">
    <div class="home-body explorer-body">
      <div
        v-if="globalData.blocks.length"
        class="container"
      >
        <div
          v-if="!!coinStats"
          class="explorer-card status-card"
        >
          <CoinStats :stats="coinStats" />
        </div>

        <div class="explorer-card status-card">
          <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-block-count" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ globalData.blockCount | number }}
                  </div>
                  <h1>Block Count</h1>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-tx-count" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ globalData.blockLatency | blockLatency }}
                  </div>
                  <h1>Block Latency</h1>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-node-count" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ globalData.nodeCount | number }}
                  </div>
                  <h1>Node Count</h1>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-shard-count" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ globalData.shardCount | number }}
                  </div>
                  <h1>Shard Count</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="explorer-card">
        <div
          v-for="(block, shard) in lastBlocks"
          :key="shard"
          class="shard"
        >
          <header>
            <h1>          
              <router-link
                  :to="'/shard/' + shard"
                  class="data-shard"
                >
                  Shard {{ shard }}
                </router-link>
            </h1>
          </header>
          <div class="explorer-card-body">
            <section>
              <table
                class="explorer-table"
              >
                <tr>
                  <td class="td-title">
                    Height
                  </td>
                  <td>
                    <router-link
                    :to="'/block/' + block.id"
                    class="link"
                  >
                    {{ block.height | number }}
                  </router-link>
                  </td>
                </tr>
                <tr>
                  <td class="td-title">
                    Time
                  </td>
                  <td>{{ block.timestamp | timestamp }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Transactions
                  </td>
                  <td>{{  block.txCount }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Age
                  </td>
                  <td>{{ block.timestamp | age }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Transactions
                  </td>
                  <td>{{  block.txCount }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Validators
                  </td>
                  <td>{{ $store.data.shardsValidators.length > shard ? $store.data.shardsValidators[shard].length : '...' }}</td>
                </tr>
              </table>
            </section>
          </div>
        </div>
        </div>

        <CommonTabs v-model="holderTab">
          <TabPane :name="'Token Holders'">
            <section>
              <table class="explorer-table">
                <tr>
                  <td class="td-title">
                    ONE
                  </td>
                  <td>   
                    <a
                      :href="$store.data.ONE_HOLDERURL"
                      target="_blank"
                    >{{ 100000 }}</a>
                  </td>
                </tr>
                <tr
                  v-for="token in tokenHolders"
                  :key="token.id"
                >
                  <td class="td-title">
                    <Address :bech32="token.id" />
                  </td>
                  <td>
                    <a
                      :href="`${$store.data.HRC20_HOLDERURL}/${token.id}`"
                      target="_blank"
                    >{{ token.holders }}</a>
                  </td>
                </tr>
              </table>
            </section>
          </TabPane>
        </CommonTabs>

        <div class="row">
          <div
            v-if="showWhich == 'regular'"
            class="col-xs-12 col-sm-12 col-md-12 col-lg-12"
          >
            <div class="explorer-card latest-block-card">
              <header>
                <TransactionTableTabs
                  :value="tabValue"
                  :on-change="changeTab"
                  title-prefix=""
                />
                <div class="secondary-info">
                  <div class="timer">
                    Updated
                    {{
                      Math.round(
                        Math.max((now - globalData.lastUpdateTime) / 1000, 0)
                      ) | number
                    }}s ago...
                  </div>
                  <span class="total-block-num" />
                </div>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-tx-table">
                  <div class="tr">
                    <div class="th">
                      Shard
                    </div>
                    <div class="th">
                      Hash
                    </div>
                    <div class="th">
                      From
                    </div>
                    <div class="th">
                      To
                    </div>
                    <div class="th">
                      Type
                    </div>
                    <div class="th">
                      Age
                    </div>
                    <div class="th">
                      Value
                    </div>
                    <div class="th text-right">
                      Txn Fee
                    </div>
                  </div>
                  <div
                    v-for="tx in globalData.txs"
                    :key="tx.id"
                    class="tr"
                  >
                    <div class="td">
                      <router-link :to="'/shard/' + tx.shardID">
                        {{ tx.shardID }}
                      </router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/tx/' + tx.id">
                        {{ tx.id | shorten }}
                      </router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/address/' + tx.from.bech32">
                        {{ tx.from.bech32 | shorten }}
                      </router-link>
                    </div>
                    <div class="td">
                      <Address :bech32="tx.to.bech32" />
                    </div>
                    <div class="td">
                      {{ tx | txType }}
                    </div>
                    <div class="td">
                      {{ tx.timestamp | age }}
                    </div>
                    <div class="td no-break">
                      {{ tx.value | amount }}
                    </div>
                    <div class="td text-right no-break">
                      {{ tx | fee }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- <footer class="button-only-footer">
                <router-link
                  tag="button"
                  class="btn btn-light btn-block btn-mini"
                  to="txs"
                >View all transactions</router-link>
              </footer>-->
            </div>
          </div>

          <div
            v-else-if="showWhich == 'staking'"
            class="col-xs-12 col-sm-12 col-md-12 col-lg-12"
          >
            <div class="explorer-card latest-block-card">
              <header>
                <TransactionTableTabs
                  :value="tabValue"
                  :on-change="changeTab"
                  title-prefix=""
                />
                <div class="secondary-info">
                  <div class="timer">
                    Updated
                    {{
                      Math.round(
                        Math.max((now - globalData.lastUpdateTime) / 1000, 0)
                      ) | number
                    }}s ago...
                  </div>
                  <span class="total-block-num" />
                </div>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-tx-table">
                  <div class="tr">
                    <div class="th">
                      Shard
                    </div>
                    <div class="th">
                      Hash
                    </div>
                    <div class="th">
                      Type
                    </div>
                    <div class="th">
                      Validator
                    </div>
                    <div class="th">
                      Delegator
                    </div>
                    <div class="th">
                      Age
                    </div>
                    <div class="th">
                      Value
                    </div>
                    <div class="th text-right">
                      Txn Fee
                    </div>
                  </div>
                  <div
                    v-for="tx in globalData.stakingTxs"
                    :key="tx.id"
                    class="tr"
                  >
                    <div class="td">
                      <router-link :to="'/shard/' + tx.shardID">
                        {{ tx.shardID }}
                      </router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/staking-tx/' + tx.id">
                        {{ tx.id | shorten }}
                      </router-link>
                    </div>
                    <div class="td">
                      {{ tx.type }}
                    </div>
                    <div class="td">
                      <router-link
                        v-if="tx.validator.bech32"
                        :to="
                          '/address/' + tx.validator.bech32 + '?txType=staking'
                        "
                      >
                        {{ tx.validator.bech32 | shorten }}
                      </router-link>
                      <div v-else>
                        -
                      </div>
                    </div>
                    <div class="td">
                      <router-link
                        v-if="tx.delegator.bech32"
                        :to="
                          '/address/' + tx.delegator.bech32 + '?txType=staking'
                        "
                      >
                        {{ tx.delegator.bech32 | shorten }}
                      </router-link>
                      <div v-else>
                        -
                      </div>
                    </div>
                    <div class="td">
                      {{ tx.timestamp | age }}
                    </div>
                    <div class="td no-break">
                      {{ tx.value | amount }}
                    </div>
                    <div class="td text-right no-break">
                      {{ tx | fee }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- <footer class="button-only-footer">
                <router-link
                  tag="button"
                  class="btn btn-light btn-block btn-mini"
                  to="txs"
                >View all transactions</router-link>
              </footer>-->
            </div>
          </div>

          <div
            v-else
            class="col-xs-12 col-sm-12 col-md-12 col-lg-12"
          >
            <div class="explorer-card latest-block-card">
              <header>
                <TransactionTableTabs
                  :value="tabValue"
                  :on-change="changeTab"
                  title-prefix=""
                />
                <div class="secondary-info">
                  <div class="timer">
                    Updated
                    {{
                      Math.round(
                        Math.max((now - globalData.lastUpdateTime) / 1000, 0)
                      ) | number
                    }}s ago...
                  </div>
                  <span class="total-block-num" />
                </div>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-tx-table">
                  <div class="tr">
                    <div class="th">
                      Shard
                    </div>
                    <div class="th">
                      Hash
                    </div>
                    <div class="th">
                      From
                    </div>
                    <div class="th">
                      To
                    </div>
                    <div class="th">
                      Token
                    </div>
                    <div class="th">
                      Age
                    </div>
                    <div class="th">
                      Token Amount
                    </div>
                  </div>
                  <div
                    v-for="tx in Hrc20Txs"
                    :key="tx.tx.id"
                    class="tr"
                  >
                    <div class="td">
                      <router-link :to="'/shard/' + tx.tx.shardID">
                        {{ tx.tx.shardID }}
                      </router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/tx/' + tx.tx.id">
                        {{ tx.tx.id | shorten }}
                      </router-link>
                    </div>
                    <div class="td">
                      <Address :bech32="tx.hrc20tx.from" />
                    </div>
                    <div class="td">
                      <router-link :to="'/address/' + tx.hrc20tx.to">
                        {{ tx.hrc20tx.to | shorten }}
                      </router-link>
                    </div>
                    <div class="td">
                      <Address :bech32="tx.tx.to.bech32"/>
                    </div>
                    <div class="td">
                      {{ tx.tx.timestamp | age }}
                    </div>
                    <div class="td" :title="tx.hrc20tx.amount">
                      {{ hrc20Balance(tx.tx.to.bech32, tx.hrc20tx.amount) }}
                    </div>
                  </div>
                </div>
              </div>
              <!-- <footer class="button-only-footer">
                <router-link
                  tag="button"
                  class="btn btn-light btn-block btn-mini"
                  to="txs"
                >View all transactions</router-link>
              </footer>-->
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="container"
      >
        <loading-message />
      </div>
    </div>
  </div>
</template>

<script>
import store from '../explorer/store';
import LoadingMessage from './LoadingMessage';
import CoinStats from './CoinStats';
import TransactionTableTabs from './TransactionTableTabs';
import Address from './Address';
import CommonTabs from './HrcTokenTabs';
import TabPane from './TabPane';

export default {
  name: 'HomePage',
  components: {
    LoadingMessage,
    CoinStats,
    TransactionTableTabs,
    Address,
    CommonTabs,
    TabPane,
  },
  filters: {
    onlyData(fulldata) {
      return fulldata.slice(0, 10);
    },
    onlyTime(fulldata) {
      return fulldata.slice(11);
    },
  },
  data() {
    return {
      globalData: store.data,
      pageIndex: 0,
      pageSize: 50,
      timer: null,
      now: Date.now(),
      showTx: true,
      coinStats: null,
      holderTab: null,
      tokenHolders: [],
    };
  },
  computed: {
    length() {
      return Math.ceil(this.globalData.blocks.length / this.pageSize);
    },
    showWhich() {
      return this.$route.query.txType || 'regular'; // 'staking','regular','hrc20';
    },
    tabValue() {
      const status = { staking: 1, regular: 0, hrc20: 2 };
      return status[this.$route.query.txType] || 0;
    },
    lastBlocks() {
      return Object.values(this.$store.data.shards).map(
        shard => shard.blocks[0]
      );
    },
    Hrc20Address() {
      return this.$store.data.Hrc20Address;
    },
    Hrc20Txs() {
      return this.$store.data.hrc20Txs.reduce((list, tx) => {
        const c = this.$store.data.hmy.contract(this.$store.data.HRC20_ABI);
        const decodeObj = c.decodeInput(tx.input);
        if (decodeObj.abiItem && decodeObj.abiItem.name == 'transfer')
          list.push({
            tx,
            hrc20tx: {
              from: tx.from.bech32,
              to: decodeObj.params[0],
              amount: decodeObj.params[1],
            },
          });
        else if (decodeObj.abiItem && decodeObj.abiItem.name == 'transferFrom')
          list.push({
            tx,
            hrc20tx: {
              from: decodeObj.params[0],
              to: decodeObj.params[1],
              amount: decodeObj.params[2],
            },
          });
        return list;
      }, []);
    },
  },
  watch: {
    globalData() {
      this.resetTimer();
    },
    Hrc20Address() {
      this.updateHolders();
    },
  },
  mounted() {
    this.updateHolders();
    this.resetTimer();
    // service.getCoinStats().then(stats => {
    //   this.coinStats = stats;
    // });
  },
  methods: {
    hrc20info(id) {
      return this.$store.data.Hrc20Address[id];
    },
    hrc20Balance(id, amount) {
      return (
        (amount / 10 ** this.hrc20info(id).decimals).toFixed(4) +
        ' ' +
        this.hrc20info(id).symbol
      );
    },
    async updateHolders() {
      let tokenHolders = [];
      for (let hrc20 in this.Hrc20Address)
        tokenHolders.push({ id: hrc20, holders: 10000 });
      this.tokenHolders = tokenHolders;
    },
    bech32(hexaddr) {
      return this.$store.data.hmy.hmySDK.crypto.toBech32(hexaddr);
    },
    changeTab(value) {
      let txType = 'regular';
      if (value == 1) txType = 'staking';
      if (value == 2) txType = 'hrc20';
      this.$router.replace({
        name: 'HomePage',
        query: { txType },
      });
    },
    resetTimer() {
      clearInterval(this.timer);
      this.now = Date.now();
      this.timer = setInterval(() => {
        this.now = Date.now();
      }, 1000);
    },
  },
};
</script>
