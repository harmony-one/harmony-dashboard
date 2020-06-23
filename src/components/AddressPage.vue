<style scoped lang="less">
@import '../less/common.less';
.shard {
  width: 25%;
  display: inline-block;
}
.hrclogo {
  vertical-align: text-bottom;
  border-radius: 0.25rem;
  width: 1.3em;
  border: 1px solid var(--bc-dim);
  margin-left: 1em;
}
</style>

<template>
  <div class="address-page explorer-page page">
    <div class="address-body explorer-body">
      <div v-if="!loading && address" class="container">
        <div class="explorer-card">
          <header>
            <h1 v-if="isHrc20(address.id)">
              HRC20 Token:
              <img :src="Hrc20Info.logo" class="hrclogo" />
              <a target="_blank" :href="Hrc20Info.website">
                {{ Hrc20Info.name + '(' + Hrc20Info.symbol + ')' }}
              </a>
            </h1>
            <h1 v-else>
              Address
            </h1>
          </header>

          <div class="explorer-card-body">
            <section>
              <table class="explorer-table">
                <tr v-if="isHrc20(address.id)">
                  <td colspan="2">
                    <tr>
                      <td class="td-title">
                        Name(Symbol)
                      </td>
                      <td>
                        {{ Hrc20Info.name + '(' + Hrc20Info.symbol + ')' }}
                      </td>
                    </tr>

                    <tr>
                      <td class="td-title">
                        Decimals
                      </td>
                      <td>{{ Hrc20Info.decimals }}</td>
                    </tr>

                    <tr>
                      <td class="td-title">
                        TotalSupply
                      </td>
                      <td>{{ Hrc20Info.totalSupply }}</td>
                    </tr>

                    <tr>
                      <td class="td-title">
                        Description
                      </td>
                      <td>{{ Hrc20Info.description.en }}</td>
                    </tr>
                  </td>
                </tr>

                <tr>
                  <td class="td-title">
                    id
                  </td>
                  <td>{{ address.id }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Balance
                  </td>
                  <td>{{ address.balance | amount }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Transactions
                  </td>
                  <td>{{ txCount | number }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Staking Transactions
                  </td>
                  <td>{{ stakingTxCount | number }}</td>
                </tr>
              </table>
            </section>
          </div>
        </div>
        <div
          v-for="(shard, index) in address.shardData"
          :key="index"
          class="explorer-card shard"
        >
          <header>
            <h1>Shard {{ index }}</h1>
          </header>
          <div class="explorer-card-body">
            <section>
              <div v-if="shard.err" class="text-error">
                {{ shard.err }}
              </div>
              <table v-else class="explorer-table">
                <tr>
                  <td class="td-title">
                    Balance
                  </td>
                  <td>{{ shard.balance | amount }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Transactions
                  </td>
                  <td>{{ shard.txCount | number }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Staking transactions
                  </td>
                  <td>{{ shard.stakingTxCount | number }}</td>
                </tr>
              </table>
            </section>
          </div>
        </div>

        <HrcTokenTabs v-model="HrcTabActive">
          <TabPane :name="'HRC20'">
            <section>
              <table class="explorer-table">
                <tr v-for="balanceOf in Hrc20Balance" :key="balanceOf.id">
                  <td class="td-title">
                    <Address :bech32="balanceOf.id" />
                  </td>
                  <td>
                    {{ balanceOf.balance }}
                  </td>
                </tr>
              </table>
            </section>
          </TabPane>
          <TabPane :name="'HRC721'">
            comming soon...
          </TabPane>
        </HrcTokenTabs>

        <TransactionsTable
          v-if="showWhich == 'regular'"
          :all-txs="allTxs"
          with-shards="true"
          :page="page"
          :changePage="changePage"
        >
          <slot>
            <TransactionTableTabs :value="tabValue" :on-change="changeTab" />
          </slot>
        </TransactionsTable>
        <Hrc20TransactionsTable
          v-else-if="showWhich == 'hrc20'"
          :all-txs="allTxs"
          with-shards="true"
          :page="page"
          :changePage="changePage"
        >
          <slot>
            <TransactionTableTabs :value="tabValue" :on-change="changeTab" />
          </slot>
        </Hrc20TransactionsTable>
        <StakingTransactionsTable
          v-else
          :all-staking-txs="allStakingTxs"
          with-shards="true"
          :page="page"
          :changePage="changePage"
        >
          <slot>
            <TransactionTableTabs :value="tabValue" :on-change="changeTab" />
          </slot>
        </StakingTransactionsTable>
      </div>
      <div v-else class="container">
        <loading-message v-if="false" />
      </div>
    </div>
  </div>
</template>

<script>
import service from '../explorer/service';
import LoadingMessage from './LoadingMessage';
import TransactionsTable from './TransactionsTable';
import StakingTransactionsTable from './StakingTransactionsTable';
import Hrc20TransactionsTable from './Hrc20TransactionsTable';
import TransactionTableTabs from './TransactionTableTabs';
import HrcTokenTabs from './HrcTokenTabs';
import TabPane from './TabPane';
import Address from './Address';

const status = { staking: 1, regular: 0, hrc20: 2 };
const defaultStatus = 'regular';
export default {
  name: 'AddressPage',
  components: {
    LoadingMessage,
    TransactionsTable,
    StakingTransactionsTable,
    TransactionTableTabs,
    Hrc20TransactionsTable,
    HrcTokenTabs,
    TabPane,
    Address,
  },
  data() {
    return {
      loading: true,
      address: null,
      allTxs: [],
      allStakingTxs: [],
      HrcTabActive: '',
      Hrc20Balance: [],
    };
  },
  computed: {
    txCount() {
      return this.allTxs.length;
    },
    stakingTxCount() {
      return this.allStakingTxs.length;
    },
    showWhich() {
      return this.$route.query.txType || defaultStatus; // 'staking','regular','hrc20';
    },
    page() {
      return this.$route.query.page - 1 || 0;
    },
    tabValue() {
      return status[this.$route.query.txType] != undefined
        ? status[this.$route.query.txType]
        : status[defaultStatus];
    },
    Hrc20Info() {
      return this.$store.data.Hrc20Address[this.address.id];
    },
  },
  watch: {
    $route() {
      if (this.$route.params.address !== (this.address && this.address.id)) {
        this.getAddress();
      }
    },
  },
  mounted() {
    this.getAddress();
  },
  methods: {
    changeTab(value) {
      let txType = 'regular';
      if (value == 1) txType = 'staking';
      if (value == 2) txType = 'hrc20';
      this.$router.replace({
        name: 'AddressPage',
        query: { txType },
      });
    },
    changePage(value) {
      this.$router.replace({
        name: 'AddressPage',
        query: { page: value + 1, txType: this.$route.query.txType },
      });
    },
    getAddress() {
      this.loading = true;
      const txs = {};
      const stakingTxs = {};

      const address = this.$route.params.address;

      service
        .getAddress(address)
        .then(address => {
          address.shardData.forEach((data, idx) => {
            if (data.txs) {
              data.txs.forEach(tx => {
                txs[tx.hash] = {
                  ...tx,
                  shardID: idx,
                };
              });
            }
            if (data.stakingTxs) {
              data.stakingTxs.forEach(tx => {
                stakingTxs[tx.hash] = {
                  ...tx,
                  shardID: idx,
                  delegator: tx.msg.delegatorAddress,
                  validator: tx.msg.validatorAddress,
                  value: tx.msg.amount,
                };
              });
            }
          });

          this.address = address;
          this.hrc20BalanceOf();
        })
        .finally(() => {
          this.allTxs = Object.values(txs).sort((a, b) =>
            Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
          );
          this.allStakingTxs = Object.values(stakingTxs).sort((a, b) =>
            Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
          );

          this.loading = false;
        });
    },
    isHrc20(address) {
      return this.$store.data.Hrc20Address[address] != undefined;
    },
    async hrc20BalanceOf() {
      const hmy = this.$store.data.hmy;
      const toHex = hmy.hmySDK.crypto.fromBech32;
      console.log('hrc20', this.address);
      for (let hrc20 in this.$store.data.Hrc20Address) {
        const c = hmy.contract(this.$store.data.HRC20_ABI, toHex(hrc20));
        let balance = await c.methods.balanceOf(toHex(this.address.id)).call();
        this.Hrc20Balance.push({ id: hrc20, balance: balance.toString() });
      }
    },
  },
};
</script>
