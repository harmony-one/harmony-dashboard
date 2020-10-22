<style>
.vs__search {
  color: #888;
}

.vs__dropdown-option {
  color: #888;
}

.vs__dropdown-option--highlight {
  background: var(--color-table-link);
  color: white;
}

.vs__search::placeholder {
  color: #888;
}
</style>

<style scoped lang="less">
@import '../less/common.less';

.avatar-wrapper {
  margin-left: 1em;
}

.avatar {
  border-radius: 100%;
  display: table-cell;
  background-color: #47e0cd;
  color: white;
  height: 25px;
  width: 25px;
  font-weight: bold;
  text-transform: capitalize;
  text-align: center;
  vertical-align: middle;
  font-size: 15px;
  padding: 0;
  margin: 0;
}

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
      <div v-if="showPanel" class="container">
        <div class="explorer-card">
          <header>
            <h1 v-if="isHrc20(address.id)">
              HRC20 Token:
              <span v-if="Hrc20Info.logo">
                <img :src="Hrc20Info.logo" class="hrclogo" />
              </span>
              <span v-if="!Hrc20Info.logo" class="avatar-wrapper">
                <span class="avatar" :style="bgStyle()">{{
                  Hrc20Info.name[0]
                }}</span>
              </span>
              <a target="_blank" :href="Hrc20Info.website">
                {{ Hrc20Info.name + '(' + Hrc20Info.symbol + ')' }}
              </a>
            </h1>
            <h1 v-else>
              {{ title }}
            </h1>
          </header>

          <div class="explorer-card-body">
            <section>
              <table class="explorer-table">
                <tr v-if="isHrc20(address.id)">
                  <td class="td-title">
                    Name(Symbol)
                  </td>
                  <td>
                    {{ Hrc20Info.name + '(' + Hrc20Info.symbol + ')' }}
                  </td>
                </tr>

                <tr v-if="isHrc20(address.id)">
                  <td class="td-title">
                    Decimals
                  </td>
                  <td>{{ Hrc20Info.decimals }}</td>
                </tr>

                <tr v-if="isHrc20(address.id)">
                  <td class="td-title">
                    Total Supply
                  </td>
                  <td>{{ Hrc20Info.totalSupplyDisplay }}</td>
                </tr>

                <!-- <tr>
                  <td class="td-title">
                    Description
                  </td>
                  <td>{{ Hrc20Info.description.en }}</td>
                </tr>-->

                <tr>
                  <td class="td-title">
                    {{ isHrc20(address.id) ? 'Contract' : 'ID' }}
                  </td>
                  <td>{{ address.id }}</td>
                </tr>

                <tr v-if="isContract">
                  <td class="td-title">
                    Creater Address
                  </td>
                  <td>
                    <Address
                      :bech32="contractData.authorAddress"
                      show-raw="true"
                    />
                  </td>
                </tr>

                <tr v-if="isContract">
                  <td class="td-title">
                    Transaction ID
                  </td>
                  <td>
                    <router-link :to="'/tx/' + contractData.txId">
                      {{ contractData.txId | shorten }}
                    </router-link>
                  </td>
                </tr>

                <tr>
                  <td class="td-title">
                    ONE Balance
                  </td>
                  <td>
                    {{ address.balance | amount }}
                    <img src="../assets/arrow1.png" @click="showBalance" />
                  </td>
                </tr>
                <tr
                  v-for="(shard, index) in address.shardData"
                  :key="`balance${index}`"
                  class="shard"
                >
                  <td v-if="allBalance" class="td-title">
                    Shard {{ index }} : {{ shard.balance | amount }}
                  </td>
                </tr>

                <!-- v-if="
                   !hrc20BalancesDropdownOptions ||
                     hrc20BalancesDropdownOptions.length > 0
                 "-->
                <tr>
                  <td class="td-title">
                    Token
                  </td>
                  <td>
                    <div style="max-width: 500px">
                      <v-select
                        :disabled="
                          hrc20BalancesDropdownOptions &&
                            hrc20BalancesDropdownOptions.length === 0
                        "
                        :placeholder="hrc20BalancesDropdownPlaceholder"
                        :components="{ OpenIndicator: null }"
                        :options="hrc20BalancesDropdownOptions"
                        @input="onHrc20BalancesDropdown"
                      ></v-select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="td-title">
                    Transactions
                  </td>
                  <td>
                    {{ txCount | number }}
                    <img src="../assets/arrow1.png" @click="showTxs" />
                  </td>
                </tr>
                <tr
                  v-for="(shard, index) in address.shardData"
                  :key="`txCount${index}`"
                  class="shard"
                >
                  <td v-if="allTxsCount" class="td-title">
                    Shard {{ index }} : {{ shard.txCount | number }}
                  </td>
                </tr>

                <tr>
                  <td class="td-title">
                    Staking Transactions
                  </td>
                  <td>
                    {{ stakingTxCount | number }}
                    <img src="../assets/arrow1.png" @click="showStakingTxs" />
                  </td>
                </tr>

                <tr
                  v-for="(shard, index) in address.shardData"
                  :key="`stakingTxCount${index}`"
                  class="shard"
                >
                  <td v-if="allStakingCount" class="td-title">
                    Shard {{ index }} : {{ shard.stakingTxCount | number }}
                  </td>
                </tr>
              </table>
            </section>
          </div>
        </div>

        <HrcTokenTabs v-if="false && showHrc20Section">
          <TabPane :name="'HRC20 Balance'">
            <section>
              <table class="explorer-table">
                <div v-for="balanceOf in Hrc20Balance" :key="balanceOf.address">
                  <tr v-if="+balanceOf.balance">
                    <td v-if="+balanceOf.balance" class="td-title">
                      &lt;!&ndash;v-if="balanceOf.balance !==0"&ndash;&gt;
                      <Address :bech32="balanceOf.id" />
                    </td>
                    <td>
                      {{ balanceOf.balance }}
                    </td>
                  </tr>
                </div>
              </table>
            </section>
          </TabPane>
          <TabPane v-if="false" :name="'HRC721'">
            coming soon...
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
            <TransactionTableTabs :value="tabValue" :on-change="changeTab" />
          </slot>
        </TransactionsTable>
        <Hrc20TransactionsTable
          v-else-if="showWhich == 'hrc20'"
          :all-txs="hrc20Txs"
          with-shards="true"
          :loading="loading"
          :tx-count="hrc20TxsCount"
          :page="page"
          :change-page="changePage"
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
          :change-page="changePage"
          :loading="loading"
          :tx-count="stakingTxCount"
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
import service from '../explorer/service'
import LoadingMessage from './LoadingMessage'
import TransactionsTable from './TransactionsTable'
import StakingTransactionsTable from './StakingTransactionsTable'
import Hrc20TransactionsTable from './Hrc20TransactionsTable'
import TransactionTableTabs from './TransactionTableTabs'
import HrcTokenTabs from './HrcTokenTabs'
import TabPane from './TabPane'
import Address from './Address'
import { displayAmount } from '@/utils/displayAmount'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const status = { staking: 1, regular: 0, hrc20: 2 }
const defaultStatus = 'regular'
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
    vSelect,
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
      hrc20TxsCount: 0,
      allStakingTxs: [],
      txCount: 0,
      stakingTxCount: 0,
      Hrc20Balance: {},
      $store: this.$store.data,
    }
  },
  computed: {
    title() {
      return this.isContract ? 'Contract' : 'Address'
    },
    isContract() {
      return this.contractData && this.contractData.txId
    },
    hrc20BalancesDropdownPlaceholder() {
      if (!Object.values(this.Hrc20Balance).length) {
        return 'Loading...'
      }
      const tokensCount = Object.values(this.Hrc20Balance).filter(
        o => +o.balance !== 0 // || true
      ).length

      return `HRC20 Tokens (${tokensCount})`
    },
    hrc20BalancesDropdownOptions() {
      return Object.values(this.Hrc20Balance)
        .filter(o => +o.balance !== 0)
        .map(o => ({
          label: `${o.name} (${o.id}) - ${o.balance}`,
          code: o.address,
        }))
    },
    showWhich() {
      return this.$route.query.txType || defaultStatus // 'staking','regular','hrc20';
    },
    showHrc20Section() {
      if (!this.Hrc20Balance) {
        return false
      }
      return Object.values(this.Hrc20Balance).reduce(
        (a, o) => a || +o.balance,
        false
      )
    },
    page() {
      return this.$route.query.page - 1 || 0
    },
    tabValue() {
      return status[this.$route.query.txType] != undefined
        ? status[this.$route.query.txType]
        : status[defaultStatus]
    },
    Hrc20Address() {
      return this.$store.data.Hrc20Address
    },
    Hrc20Info() {
      const res = this.Hrc20Address[this.address.id]

      const totalSupplyDisplay = displayAmount(res.totalSupply, res.decimals)

      res.totalSupplyDisplay = totalSupplyDisplay
      return res
    },
    showPanel() {
      return (
        !this.loading ||
        this.$route.params.address === (this.address && this.address.id)
      )
    },
  },
  watch: {
    Hrc20Address() {
      if (this.address) this.hrc20BalanceUpdate()
    },
    $route() {
      if (this.$route.params.address !== (this.address && this.address.id)) {
        this.getAddress()
      }
    },
    page() {
      this.getAddress()
    },
  },
  mounted() {
    this.getAddress()
  },
  methods: {
    onHrc20BalancesDropdown(val) {
      this.$router.push(`/address/${val.code}`)
    },
    onHrc20BalanceDropdown() {
      alert(1)
      console.log('onHrc20BalanceDropdown')
    },
    onError() {
      this.Hrc20Info.logo = null
    },
    bgStyle() {
      if (!this.Hrc20Info.name) {
        return {}
      }
      const palette = [
        '#00ffff',
        '#24dbff',
        '#49b6ff',
        '#6d92ff',
        '#926dff',
        '#b649ff',
        '#db24ff',
        '#ff00ff',
      ]
      const c = this.Hrc20Info.name.charCodeAt(0) % palette.length
      const backgroundColor = palette[c]
      return { backgroundColor: backgroundColor }
    },
    changeTab(value) {
      let txType = 'regular'
      if (value == 1) txType = 'staking'
      if (value == 2) txType = 'hrc20'
      this.$router.replace({
        name: 'AddressPage',
        query: { txType },
      })
    },
    changePage(value, hrc20QueryID) {
      this.$router.replace({
        name: 'AddressPage',
        query: {
          page: value + 1,
          txType: this.$route.query.txType,
          hrc20QueryID,
        },
      })
    },
    getAddress() {
      this.loading = true
      const txs = {}
      const stakingTxs = {}

      const address = this.$route.params.address
      const sortid = this.$route.params.hrc20QueryID

      service
        .getHrc20Txs({
          id: address,
          pageSize: 20,
          pageIndex: this.page,
          sortid,
        })
        .then(result => {
          this.hrc20Txs = result.txs
          this.hrc20TxsCount = result.total
        })

      service
        .getAddressFullInfo({ id: address, pageIndex: this.page, pageSize: 20 })
        .then(({ address, contractData }) => {
          address.shardData.forEach((data, idx) => {
            if (data.txs) {
              data.txs.forEach(tx => {
                txs[tx.hash] = {
                  ...tx,
                  shardID: idx,
                }
              })
            }
            if (data.stakingTxs) {
              data.stakingTxs.forEach(tx => {
                stakingTxs[tx.hash] = {
                  ...tx,
                  shardID: idx,
                  delegator: tx.msg.delegatorAddress,
                  validator: tx.msg.validatorAddress,
                  value: tx.msg.amount,
                }
              })
            }
          })

          this.txCount = address.txCount
          this.stakingTxCount = address.stakingTxCount

          // if address is deployed contract
          this.contractData = contractData
          this.address = address
          this.hrc20BalanceUpdate()
        })
        .finally(() => {
          this.allTxs = Object.values(txs).sort((a, b) =>
            Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
          )
          this.allStakingTxs = Object.values(stakingTxs).sort((a, b) =>
            Number(a.timestamp) > Number(b.timestamp) ? -1 : 1
          )

          this.loading = false
        })
    },
    isHrc20(address) {
      return this.Hrc20Address[address] != undefined
    },
    async hrc20BalanceUpdate() {
      const hmy = this.$store.data.hmy
      const toHex = hmy.hmySDK.crypto.fromBech32

      const res = {}

      Promise.all(
        Object.keys(this.Hrc20Address).map(async hrc20 => {
          //for (let hrc20 in this.Hrc20Address) {
          //if (this.Hrc20Balance[hrc20]) continue;
          const c = hmy.contract(this.$store.data.HRC20_ABI, toHex(hrc20))
          const hrc20Info = this.Hrc20Address[hrc20]
          let balance

          try {
            balance = await c.methods.balanceOf(toHex(this.address.id)).call()
          } catch (e) {
            // ...
          }

          const balanceDisplay = displayAmount(balance, hrc20Info.decimals)

          return {
            [hrc20]: {
              name: hrc20Info.name,
              id: hrc20Info.symbol,
              balance: balanceDisplay,
              address: hrc20Info.address,
            },
          }
        })
      )
        .then(res => res.reduce((a, o) => ({ ...a, ...o }), {}))
        .then(res => {
          this.Hrc20Balance = res
        })
    },
    showBalance() {
      ;(this.allBalance = !this.allBalance),
        (this.allTxsCount = false),
        (this.allStakingCount = false)
    },
    showTxs() {
      ;(this.allBalance = false),
        (this.allTxsCount = !this.allTxsCount),
        (this.allStakingCount = false)
    },
    showStakingTxs() {
      ;(this.allBalance = false),
        (this.allTxsCount = false),
        (this.allStakingCount = !this.allStakingCount)
    },
  },
}
</script>
