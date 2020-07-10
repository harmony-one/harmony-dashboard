<style scoped lang="less">
@import '../less/common.less';
.hrclogo {
  vertical-align: text-bottom;
  border-radius: 0.25rem;
  width: 1.3em;
  border: 1px solid var(--bc-dim);
  margin-left: 1em;
}
.selectItem {
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: unset;
  color: unset;
  background-color: rgba(0, 0, 0, 0);
  /*appearance: none;*/
}
.selectItem:focus {
  box-shadow: none !important;
}
</style>

<template>
  <div class="address-page explorer-page page">
    <div class="address-body explorer-body">
      <div
        v-if="showPanel"
        class="container"
      >
        <div class="explorer-card">
          <header>
            <h1 v-if="isHrc20(address.id)">
              HRC20 Token:
              <img
                :src="Hrc20Info.logo"
                class="hrclogo"
              >
              <a
                target="_blank"
                :href="Hrc20Info.website"
              >
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
                  <td>
                    {{ address.balance | amount }}
                    <img
                      src="../assets/arrow1.png"
                      @click="showBalance"
                    >
                  </td>
                </tr>
                <tr
                  v-for="(shard, index) in address.shardData"
                  :key="index"
                  class="shard"
                >
                  <td
                    v-if="allBalance"
                    class="td-title"
                  />
                  <td v-if="allBalance">
                    Shard {{ index }} : {{ shard.balance | amount }}
                  </td>
                </tr>
                <tr>
                  <td class="td-title">
                    Transactions
                  </td>
                  <td>
                    {{ txCount | number }}
                    <img
                      src="../assets/arrow1.png"
                      @click="showTxs"
                    >
                  </td>
                </tr>
                <tr
                  v-for="(shard, index) in address.shardData"
                  :key="index"
                  class="shard"
                >
                  <td
                    v-if="allTxsCount"
                    class="td-title"
                  />
                  <td v-if="allTxsCount">
                    Shard {{ index }} : {{ shard.txCount | number }}
                  </td>
                </tr>


                <tr>
                  <td class="td-title">
                    Staking Transactions
                  </td>
                  <td>
                    {{ stakingTxCount | number }}
                    <img
                      src="../assets/arrow1.png"
                      @click="showStakingTxs"
                    >
                  </td>
                </tr>
                <tr
                  v-for="(shard, index) in address.shardData"
                  :key="index"
                  class="shard"
                >
                  <td
                    v-if="allStakingCount"
                    class="td-title"
                  />
                  <td v-if="allStakingCount">
                    Shard {{ index }} : {{ shard.stakingTxCount | number }}
                  </td>
                </tr>
              </table>
            </section>
          </div>
        </div>

        <HrcTokenTabs>
          <TabPane :name="'HRC20 Balance'">
            <section>
              <table class="explorer-table">
                <tr
                  v-for="balanceOf in Hrc20Balance"
                  :key="balanceOf.id"
                >
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
          <TabPane
            v-if="false"
            :name="'HRC721'"
          >
            comming soon...
          </TabPane>
        </HrcTokenTabs>

        <TransactionsTable
          v-if="showWhich == 'regular'"
          :all-txs="allTxs"
          with-shards="true"
          :tx-count="txCount"
          :page="page"
          :loading="loading"
          :change-page="changePage"
        >
          <slot>
            <TransactionTableTabs
              :value="tabValue"
              :on-change="changeTab"
            />
          </slot>
        </TransactionsTable>
        <Hrc20TransactionsTable
          v-else-if="showWhich == 'hrc20'"
          :all-txs="hrc20Txs"
          with-shards="true"
          :loading="loading"
          :tx-count="txCount"
          :page="page"
          :change-page="changePage"
        >
          <slot>
            <TransactionTableTabs
              :value="tabValue"
              :on-change="changeTab"
            />
          </slot>
        </Hrc20TransactionsTable>
        <StakingTransactionsTable
          v-else
          :all-staking-txs="allStakingTxs"
          with-shards="true"
          :page="page"
          :change-page="changePage"
          :loading="loading"
          :tx-count="stakingTxCount"
        >
          <slot>
            <TransactionTableTabs
              :value="tabValue"
              :on-change="changeTab"
            />
          </slot>
        </StakingTransactionsTable>
      </div>
      <div
        v-else
        class="container"
      >
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
      allBalance: false,
      allTxsCount: false,
      allStakingCount: false,
      loading: true,
      address: null,
      allTxs: [],
      hrc20Txs: [],
      allStakingTxs: [],
      txCount: 0,
      stakingTxCount: 0,
      Hrc20Balance: {},
      $store: this.$store.data,
    };
  },
  computed: {
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
    Hrc20Address() {
      return this.$store.data.Hrc20Address;
    },
    Hrc20Info() {
      return this.Hrc20Address[this.address.id];
    },
    showPanel() {
      return (
        !this.loading ||
        this.$route.params.address === (this.address && this.address.id)
      );
    },
  },
  watch: {
    Hrc20Address() {
      if (this.address) this.hrc20BalanceOf();
    },
    $route() {
      if (this.$route.params.address !== (this.address && this.address.id)) {
        this.getAddress();
      }
    },
    page() {
      this.getAddress();
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
        .getHrc20Txs({ id: address })
        .then(txs => (this.hrc20Txs = txs.reverse()));

      service
        .getAddress({ id: address, pageIndex: this.page, pageSize: 20 })
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

          this.txCount = address.txCount;
          this.stakingTxCount = address.stakingTxCount;

          let needUpdate = !this.address || this.address.id != address.id;
          this.address = address;
          needUpdate && this.hrc20BalanceOf();
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
      return this.Hrc20Address[address] != undefined;
    },
    async hrc20BalanceOf() {
      const hmy = this.$store.data.hmy;
      const toHex = hmy.hmySDK.crypto.fromBech32;
      for (let hrc20 in this.Hrc20Address) {
        if (this.Hrc20Balance[hrc20]) continue;
        const c = hmy.contract(this.$store.data.HRC20_ABI, toHex(hrc20));
        const hrc20Info = this.Hrc20Address[hrc20];
        let balance;
        try {
          balance = await c.methods.balanceOf(toHex(this.address.id)).call();
        } catch (e) {
          // ...
        }
        this.$set(this.Hrc20Balance, hrc20, {
          id: hrc20,
          balance:
            balance == undefined
              ? 'error'
              : balance.toString() / 10 ** hrc20Info.decimals,
        });
      }
    },
    showBalance() {
      (this.allBalance = !this.allBalance),
        (this.allTxsCount = false),
        (this.allStakingCount = false);
    },
    showTxs() {
      (this.allBalance = false),
        (this.allTxsCount = !this.allTxsCount),
        (this.allStakingCount = false);
    },
    showStakingTxs() {
      (this.allBalance = false),
        (this.allTxsCount = false),
        (this.allStakingCount = !this.allStakingCount);
    },
  },
};
</script>
