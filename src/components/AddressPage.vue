<style>
.vs__search {
  color: #666;
}

.vs__dropdown-option {
  color: #666;
}

.vs__dropdown-option--highlight {
  background: var(--color-table-link);
  color: white;
}

.vs__search::placeholder {
  color: #666;
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

.export-transactions {
  background: white;
  text-align: right;
  font-size: 12px;
  padding: 1em 1.5em;
  margin-bottom: 1.5em;
  border-radius: 4px;
}
</style>

<template>
  <div class="address-page explorer-page page">
    <div class="address-body explorer-body">
      <div v-if="showPanel" class="container">
        <div class="explorer-card">
          <header>
            <h1 v-if="isHrc721(address.id)">
              <span>
                HRC721 Token:
                <span :style="bgStyle(isHrc721(address.id).name)">
                  {{ isHrc721(address.id).name }} (<b>{{
                    isHrc721(address.id).symbol
                  }}</b
                  >)
                </span>
              </span>
            </h1>

            <h1 v-else-if="isHrc20(address.id)">
              HRC20 Token:
              <!--              <span v-if="Hrc20Info.logo">
                <img :src="Hrc20Info.logo" class="hrclogo" />
              </span>-->
              <span v-if="!Hrc20Info.logo">
                <span :style="bgStyle(Hrc20Info.name)">
                  {{ Hrc20Info.name }} (<b>{{ Hrc20Info.symbol }}</b
                  >)
                </span>
              </span>
            </h1>
            <h1 v-else>
              {{ title }}
            </h1>
          </header>

          <div class="explorer-card-body">
            <section>
              <table class="explorer-table">
                <tr v-if="isHrc721(address.id)">
                  <td class="td-title">
                    Name(Symbol)
                  </td>
                  <td>
                    {{
                      isHrc721(address.id).name +
                        "(" +
                        isHrc721(address.id).symbol +
                        ")"
                    }}
                  </td>
                </tr>

                <tr v-if="isHrc721(address.id)">
                  <td class="td-title">
                    Total Supply
                  </td>
                  <td>
                    {{ hrc721TotalSupply || "—" }}
                  </td>
                </tr>

                <tr v-if="isHrc721(address.id)">
                  <td class="td-title">
                    Holders
                  </td>
                  <td>
                    {{
                      hrc721Assets
                        ? Object.keys(
                          Object.values(hrc721Assets).reduce(
                            (a, b) => ({ ...a, [b.owner]: 1 }),
                            {}
                          )
                        ).length || "—"
                        : "—"
                    }}
                  </td>
                </tr>

                <tr v-if="isHrc721(address.id)">
                  <td class="td-title">
                    Transfers
                  </td>
                  <td>
                    {{ Object.keys(hrc721Transactions).length || "—" }}
                  </td>
                </tr>

                <tr v-if="isHrc20(address.id)">
                  <td class="td-title">
                    Name(Symbol)
                  </td>
                  <td>
                    {{ Hrc20Info.name + "(" + Hrc20Info.symbol + ")" }}
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
                  <td>{{ hrc20ActualTotalSupply || Hrc20Info.totalSupplyDisplay }}</td>
                </tr>

                <!-- <tr>
                  <td class="td-title">
                    Description
                  </td>
                  <td>{{ Hrc20Info.description.en }}</td>
                </tr>-->

                <tr>
                  <td class="td-title">
                    {{
                      isHrc721(address.id) || isHrc20(address.id)
                        ? "Contract"
                        : "ID"
                    }}
                  </td>
                  <td>
                    <Address
                      :bech32="address.id"
                      show-raw="true"
                      address-only="true"
                    />
                  </td>
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

                <!--                <tr v-if="isContract">
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
                </tr>-->

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
                      <Button
                        v-if="!tokensFetching"
                        style="outline:0;border-radius:4px;cursor: pointer; border: none;background: #00aee9;padding:10px;color:white;"
                        @click="onUserActionFetchHRCTokens">
                        Fetch Tokens
                      </Button>
                      <v-select
                        v-if="tokensFetching"
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
            <TransactionTableTabs
              :show-hrc721txs="Object.values(hrc721Transactions).length"
              :show-hrc721="
                Object.values(hrc721Transactions).length ||
                  hrc721Inventory.length
              "
              :value="tabValue"
              :on-change="changeTab"
            />
          </slot>
        </TransactionsTable>

        <!-- hrc721 table -->
        <HRC721TransfersTable
          v-else-if="showWhich == 'hrc721'"
          :all-txs="Object.values(hrc721Transactions).map(a => ({ ...a }))"
          :tx-count="Object.values(hrc721Transactions).length"
          :page="page"
          :is-local="true"
          :loading="loading"
          :change-page="() => {}"
        >
          <slot>
            <TransactionTableTabs
              :show-hrc721txs="Object.values(hrc721Transactions).length"
              :show-hrc721="
                Object.values(hrc721Transactions).length ||
                  hrc721Inventory.length
              "
              :value="tabValue"
              :on-change="changeTab"
            />
          </slot>
        </HRC721TransfersTable>

        <HRC721AssetsTable
          v-else-if="showWhich == 'hrc721Assets'"
          :all-txs="
            Object.values(hrc721Assets).length > 0
              ? Object.values(hrc721Assets).map(a => ({ ...a }))
              : hrc721Inventory
          "
          :tx-count="
            Object.values(hrc721Assets).length > 0
              ? Object.values(hrc721Assets).length
              : hrc721Inventory.length
          "
          :page="page"
          :is-local="true"
          :loading="loading"
          :change-page="() => {}"
        >
          <slot>
            <TransactionTableTabs
              :show-hrc721txs="Object.values(hrc721Transactions).length"
              :show-hrc721="
                Object.values(hrc721Transactions).length ||
                  hrc721Inventory.length
              "
              :value="tabValue"
              :on-change="changeTab"
            />
          </slot>
        </HRC721AssetsTable>

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
            <TransactionTableTabs
              :show-hrc721txs="Object.values(hrc721Transactions).length"
              :show-hrc721="
                Object.values(hrc721Transactions).length ||
                  hrc721Inventory.length
              "
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
              :show-hrc721txs="Object.values(hrc721Transactions).length"
              :show-hrc721="
                Object.values(hrc721Transactions).length ||
                  hrc721Inventory.length
              "
              :value="tabValue"
              :on-change="changeTab"
            />
          </slot>
        </StakingTransactionsTable>

        <div class="export-transactions">
          <p v-if="connectStatus === 'select'">
            Download CSV Export? Sign in
            <span style="color: #0a93eb;cursor: pointer" @click="connectWallet('OneWallet')">OneWallet</span>
            /
            <span style="color: #0a93eb;cursor: pointer" @click="connectWallet('MetaMask')">MetaMask</span>
            <span style="padding-left: 8px"><font-awesome-icon icon="download" /></span>
          </p>
          <p v-if="connectStatus === 'not-self'">
            You can only export your own,
            <span style="color: #0a93eb;cursor: pointer" @click="connectWallet('Disconnect')">disconnect</span>
          </p>
          <p
            v-else-if="connectStatus === 'connected'"
            style="color: #00aee9;cursor: pointer"
            @click="exportAndDownloadTransactions">
            {{ exportStatus }}
            <span style="padding-left: 8px"><font-awesome-icon icon="download" /></span>
          </p>
        </div>
      </div>
      <div v-else class="container">
        <loading-message v-if="false" />
      </div>
    </div><div v-if="sourceCode" class="address-body" style="left:20%;position:relative">
      <div>Source Code</div>
      <textarea rows="35" cols="100" v-html="sourceCode"></textarea>
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
import HRC721TransfersTable from './HRC721TransfersTable'
import HRC721AssetsTable from './HRC721AssetsTable'
import HrcTokenTabs from './HrcTokenTabs'
import TabPane from './TabPane'
import Address from './Address'
import { displayAmount } from '@/utils/displayAmount'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import axios from 'axios'
import { HRC721LIST_URL } from '../explorer/store'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { calculateFee, formatAmount, formatTimestamp } from '@/filter'

// todo break to parts. make clean
const status = { staking: 1, regular: 0, hrc20: 2, hrc721: 3, hrc721Assets: 4 }
const defaultStatus = 'regular'
export default {
  name: 'AddressPage',
  components: {
    LoadingMessage,
    TransactionsTable,
    StakingTransactionsTable,
    TransactionTableTabs,
    HRC721TransfersTable,
    HRC721AssetsTable,
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
      Hrc721Balance: [],
      $store: this.$store.data,
      hrc721TotalSupply: null,
      hrc721Assets: {},
      hrc721Transactions: {},
      hrc721Inventory: [],
      hrc20ActualTotalSupply: 0,
      sourceCode: '',
      tokensFetching: false,
      canExport: true,
      exportStatus: 'Export And Download',
      connectStatus: 'select',
      soruceCode: '',
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
      const hrc20 = Object.values(this.Hrc20Balance)
        .filter(
          (o) => +o.balance !== 0 // || true
        )
        .filter((o) => !isNaN(o.balance)).length

      const hrc721 = this.Hrc721Balance.filter(
        (o) => +o.balance !== 0 // || true
      ).length

      return (
        [
          hrc20 > 0 ? `HRC20 - ${hrc20}` : '',
          hrc721 > 0 ? `HRC721 - ${hrc721}` : '',
        ]
          .filter((a) => a)
          .join(', ') || '—'
      )
    },
    hrc20BalancesDropdownOptions() {
      const hrc20 = Object.values(this.Hrc20Balance)
        .filter((o) => +o.balance !== 0)
        .filter((o) => !isNaN(+o.balance))
        .map((o) => ({
          label: `${o.name} (${o.id}) - ${o.balance}`,
          code: o.address,
        }))

      const hrc721 = this.Hrc721Balance.map(({ address, name, balance }) => ({
        code: address,
        label: `${name} - ${balance}`,
      }))

      return [...hrc20, ...hrc721]
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
    Hrc721Data() {
      return this.$store.data.hrc721
    },
    Hrc20Info() {
      const res = this.Hrc20Address[this.address.id]
      if (!res) {
        console.log('Hrc20Info called without reason')
        return {}
      }

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
      if (this.address) {
        //this.hrc20BalanceUpdate();
      }
    },
    Hrc721Data() {
      if (this.address) {
        this.getHRC721Data(this.address)
        //this.hrc721BalanceUpdate();
      }
    },
    $route() {
      if (this.$route.params.address !== (this.address && this.address.id)) {
        this.getAddress()
        this.refreshWalletStatus()
      }
    },
    page() {
      this.getAddress()
      this.refreshWalletStatus()
    },
  },
  created() {
    if (this.isContract()) {
      this.loadSourceCode()
    }
  },
  mounted() {
    this.getAddress()
    this.refreshWalletStatus()
  },
  methods: {
    onUserActionFetchHRCTokens() {
      if (this.tokensFetching) {
        return
      }

      this.tokensFetching = true
      this.hrc20BalanceUpdate()
      this.hrc721BalanceUpdate()
    },
    onHrc20BalancesDropdown(val) {
      this.$router.push(`/address/${val.code}`)
    },
    onHrc20BalanceDropdown() {},
    onError() {
      this.Hrc20Info.logo = null
    },
    bgStyle(name) {
      if (!name) {
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
      const c = name.charCodeAt(0) % palette.length
      const backgroundColor = palette[c]
      return { color: backgroundColor }
    },
    changeTab(value) {
      let txType = 'regular'
      if (value == 1) txType = 'staking'
      if (value == 2) txType = 'hrc20'
      if (value == 3) txType = 'hrc721'
      if (value == 4) txType = 'hrc721Assets'
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
    async loadSourceCode() {
      console.log(this.address)
      const data = await axios.get(
        `${process.env.VUE_APP_EXPLORER_BACKEND_URL}/fetchContractCode`,
        {
          params: {
            contractCode: this.address,
          },
        }
      )
      this.sourceCode = data
    },
    async connectWallet(walletType) {
      switch (walletType) {
        case 'OneWallet':
          if (onewallet) {
            const accounts = await onewallet.getAccount()
            if (accounts.address) {
              sessionStorage.setItem('connected-wallet', accounts.address)
            }
          }
          break
        case 'MetaMask':
          if (ethereum) {
            await ethereum.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }],
            })
            const accounts = await ethereum.request({
              method: 'eth_requestAccounts',
            })
            if (accounts) {
              sessionStorage.setItem('connected-wallet', accounts[0])
            }
          }
          break
        case 'Disconnect':
          onewallet.forgetIdentity()
          sessionStorage.removeItem('connected-wallet')
          break
      }
      this.refreshWalletStatus()
    },
    refreshWalletStatus() {
      const sessionData = sessionStorage.getItem('connected-wallet')
      if (sessionData) {
        const address = this.$route.params.address
        const hex = this.$store.data.hmy.hmySDK.crypto.fromBech32(address)
        if (
          sessionData.toLowerCase() === address.toLowerCase() ||
          sessionData.toLowerCase() === hex.toLowerCase()
        ) {
          this.connectStatus = 'connected'
        } else {
          this.connectStatus = 'not-self'
        }
      } else {
        this.connectStatus = 'select'
      }
    },
    async exportService(func, params, hasNextFunc, processFunc) {
      let context = { page: 0 }
      while (true) {
        const result = await func(
          Object.assign(params, { pageSize: 100, pageIndex: context.page })
        )
        processFunc(result)
        if (hasNextFunc(context, result)) {
          context.page++
        } else {
          return
        }
      }
    },
    async exportAndDownloadTransactions() {
      if (!this.canExport) return
      try {
        const address = this.$route.params.address
        const sortid = this.$route.params.hrc20QueryID
        const zip = new JSZip()
        let totalRow = 0
        this.canExport = false
        this.exportStatus = 'Exporting...'

        let csvContent = 'Shard,TxHash,From,To,Time,Token,Token Amount\n'
        let txsCsvContent =
          'TxHash,Timestamp,From ShardID,To ShardID,From,To,Value,Txn Fee\n'
        let stakingTxsCsvContent =
          'Shard,TxHash,Timestamp,Type,Validator,Delegator,Value,Txn Fee\n'
        let needExport = true

        if (localStorage.getItem(`cache_export_${address}`)) {
          let cacheData = JSON.parse(
            localStorage.getItem(`cache_export_${address}`)
          )

          if (cacheData.expired <= Date.now()) {
            localStorage.removeItem(`cache_export_${address}`)
            needExport = true
          } else {
            csvContent = cacheData.csvContent
            txsCsvContent = cacheData.txsCsvContent
            stakingTxsCsvContent = cacheData.stakingTxsCsvContent
            needExport = false
          }
        }

        if (needExport) {
          const contract = this.$store.data.hmy.contract(
            this.$store.data.HRC20_ABI
          )
          const oneArgHrc20Methods = [
            //'transfer',
            'approve',
            'mint',
            'burn',
            'burnFrom',
          ]
          const twoArgsHrc20Methods = [
            //'transferFrom',
            'allowance',
          ]

          await this.exportService(
            service.getHrc20Txs,
            { id: address, sortid: sortid },
            (context, result) => {
              context.total = result.total
              context.now = (context.now || 0) + result.txs.length
              totalRow += result.txs.length
              this.exportStatus = `Exported ${totalRow} rows...`
              return context.now < context.total && result.txs.length !== 0
            },
            (result) => {
              if (result.txs) {
                result.txs.forEach((tx) => {
                  const decodeObj = contract.decodeInput(tx.input)
                  const symbol = this.Hrc20Address[tx.to]
                  if (!symbol) return

                  let hrc20tx = {
                    from: '-',
                    to: '-',
                    amount: '-',
                  }
                  if (
                    decodeObj.abiItem &&
                    decodeObj.abiItem.name === 'transfer'
                  ) {
                    hrc20tx = {
                      from: tx.from,
                      to: decodeObj.params[0],
                      amount: decodeObj.params[1],
                    }
                  } else if (
                    decodeObj.abiItem &&
                    decodeObj.abiItem.name === 'transferFrom'
                  ) {
                    hrc20tx = {
                      from: decodeObj.params[0],
                      to: decodeObj.params[1],
                      amount: decodeObj.params[2],
                    }
                  } else if (
                    decodeObj.abiItem &&
                    oneArgHrc20Methods.includes(decodeObj.abiItem.name)
                  ) {
                    hrc20tx = {
                      from: tx.from,
                      to: decodeObj.params[0],
                      amount: decodeObj.params[1],
                    }
                  } else if (
                    decodeObj.abiItem &&
                    twoArgsHrc20Methods.includes(decodeObj.abiItem.name)
                  ) {
                    hrc20tx = {
                      from: decodeObj.params[0],
                      to: decodeObj.params[1],
                      amount: decodeObj.params[2],
                    }
                  }
                  const amount = displayAmount(hrc20tx.amount, symbol?.decimals)
                  csvContent += `${tx.shardID},${tx.hash},${hrc20tx.from},${
                    hrc20tx.to
                  },${formatTimestamp(tx.timestamp * 1000)},${symbol?.symbol} ${
                    tx.to
                  },${amount} ${symbol?.symbol}\n`
                })
              }
            }
          )

          await this.exportService(
            service.getAddressFullInfo,
            { id: address },
            (context, result) => {
              context.txCount = result.address.txCount
              context.stakingTxCount = result.address.stakingTxCount

              let currentRow = 0
              result.address.shardData.forEach((shardDataItem) => {
                if (shardDataItem.txs) {
                  context.txNow =
                    (context.txNow || 0) + shardDataItem.txs.length
                  currentRow += shardDataItem.txs.length
                }
                if (shardDataItem.stakingTxNow) {
                  context.stakingTxNow =
                    (context.stakingTxNow || 0) +
                    shardDataItem.stakingTxNow.length
                  currentRow += shardDataItem.stakingTxNow.length
                }
              })

              totalRow += currentRow
              this.exportStatus = `Exported ${totalRow} rows...`

              return (
                (context.txNow < context.txCount ||
                  context.stakingTxNow < context.stakingTxCount) &&
                currentRow !== 0
              )
            },
            (result) => {
              const addressInfo = result.address
              if (addressInfo.shardData) {
                addressInfo.shardData.forEach((shardDataItem) => {
                  if (shardDataItem.txs) {
                    shardDataItem.txs.forEach((item) => {
                      txsCsvContent += `${item.hash},${formatTimestamp(
                        item.timestamp * 1000
                      )},${item.shardID},${item.toShardID},${item.from},${
                        item.to
                      },${formatAmount(item.value)},${calculateFee(item)}\n`
                    })
                  }
                  if (shardDataItem.stakingTxs) {
                    shardDataItem.stakingTxs.forEach((item) => {
                      stakingTxsCsvContent += `${item.transactionIndex},${
                        item.hash
                      },${formatTimestamp(item.timestamp * 1000)},${
                        item.type
                      },${item.msg.validatorAddress || '-'},${
                        item.msg.delegatorAddress || '-'
                      },${formatAmount(item.msg.amount || 0)},${calculateFee(
                        item
                      )}\n`
                    })
                  }
                })
              }
            }
          )

          localStorage.setItem(
            `cache_export_${address}`,
            JSON.stringify({
              expired: Date.now() + 3600 * 1000, // 1hour
              csvContent,
              txsCsvContent,
              stakingTxsCsvContent,
            })
          )
        }

        zip.file('HRC20 Transactions.csv', csvContent)
        zip.file('Transactions.csv', txsCsvContent)
        zip.file('Staking transactions.csv', stakingTxsCsvContent)

        zip.generateAsync({ type: 'blob' }).then((content) => {
          FileSaver.saveAs(
            content,
            `export_transactions_${address.substring(0, 32)}.zip`
          )
        })

        this.exportStatus = 'Export And Download'
      } catch (e) {
        this.exportStatus = 'Export failed, try again!'
        console.log(e)
      } finally {
        this.canExport = true
      }
    },
    getAddress() {
      this.loading = true
      const txs = {}
      const stakingTxs = {}
      if (
        !(
          this.$route.params.address.startsWith('0x') ||
          this.$route.params.address.startsWith('one1')
        )
      ) {
        this.$router.push('/')
      }

      if (this.$route.params.address.startsWith('0x')) {
        this.$route.params.address = this.$store.data.hmy.hmySDK.crypto.toBech32(
          this.$route.params.address
        )
      }
      const address = this.$route.params.address
      const sortid = this.$route.params.hrc20QueryID

      service
        .getHrc20Txs({
          id: address,
          pageSize: 20,
          pageIndex: this.page,
          sortid,
        })
        .then((result) => {
          this.hrc20Txs = result.txs
          this.hrc20TxsCount = result.total
        })

      service
        .getAddressFullInfo({ id: address, pageIndex: this.page, pageSize: 20 })
        .then(async ({ address, contractData }) => {
          address.shardData.forEach((data, idx) => {
            if (data.txs) {
              data.txs.forEach((tx) => {
                txs[tx.hash] = {
                  ...tx,
                  shardID: idx,
                }
              })
            }
            if (data.stakingTxs) {
              data.stakingTxs.forEach((tx) => {
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
          await this.getHRC721Data(address)
          //this.hrc20BalanceUpdate();
          //this.hrc721BalanceUpdate();
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
      return this.Hrc20Address[address] !== undefined
    },
    isHrc721(address) {
      return (
        this.Hrc721Data &&
        this.Hrc721Data.length &&
        this.Hrc721Data.find((e) => e.contractAddress === address)
      )
    },
    async getHRC721Data() {
      // todo infos

      const info = this.isHrc721(this.address.id)
      if (!info) {
        this.hrc721Transactions = []
        this.hrc721Assets = {}
        return
      }
      const address = info.contractAddress

      const hmy = this.$store.data.hmy
      const c = hmy.contract(this.$store.data.HRC721_ABI, address)
      try {
        this.hrc721TotalSupply = (
          await c.methods.totalSupply().call()
        ).toString()
      } catch (e) {}

      const url = HRC721LIST_URL
      this.hrc721Transactions = await axios
        .get(`${url}/${address}/history`)
        .then((r) => r.data)
      this.hrc721Assets = await axios
        .get(`${url}/${address}/assets`)
        .then((r) => r.data)
    },
    async hrc721BalanceUpdate() {
      const address = this.address.id
      const hmy = this.$store.data.hmy
      const toHex = hmy.hmySDK.crypto.fromBech32
      const tokens = this.$store.data.hrc721
      this.Hrc721Balance = (
        await Promise.all(
          Object.values(tokens).map(
            async ({ name, symbol, contractAddress }) => {
              const c = hmy.contract(
                this.$store.data.HRC721_ABI,
                contractAddress
              )
              const balance = (
                await c.methods.balanceOf(toHex(address)).call()
              ).toString()

              return {
                name,
                symbol,
                address: contractAddress,
                balance,
              }
            }
          )
        )
      ).filter(({ balance }) => +balance > 0)

      this.hrc721Inventory = (
        await Promise.all(
          this.Hrc721Balance.map((o) => {
            return axios
              .get(`${HRC721LIST_URL}/${o.address}/assets`)
              .then((r) => r.data)
          })
        )
      )
        .reduce((a, b) => a.concat(Object.values(b)), [])
        .filter(({ owner }) => owner === address)

      console.log('inventory', address, this.hrc721Inventory)
    },
    async hrc20BalanceUpdate() {
      const hmy = this.$store.data.hmy
      const toHex = hmy.hmySDK.crypto.fromBech32

      const address = this.address.id
      if (this.isHrc20(address)) {
        let actualTotalSupply = 0
        try {
          const c = hmy.contract(this.$store.data.HRC20_ABI, address)
          actualTotalSupply = (await c.methods.totalSupply().call()).toString()
        } catch (e) {}
        const decimals = (this.Hrc20Address[address] || {}).decimals
        this.hrc20ActualTotalSupply =
          decimals &&
          actualTotalSupply &&
          displayAmount(actualTotalSupply, decimals)
      }

      const res = {}

      Promise.all(
        Object.keys(this.Hrc20Address).map(async (hrc20) => {
          //for (let hrc20 in this.Hrc20Address) {
          //if (this.Hrc20Balance[hrc20]) continue;
          //console.log({hrc20});

          let c
          try {
            c = hmy.contract(this.$store.data.HRC20_ABI, toHex(hrc20))
          } catch (e) {
            console.log({ e, hrc20 })
          }

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
        .then((res) => res.reduce((a, o) => ({ ...a, ...o }), {}))
        .then((res) => {
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
