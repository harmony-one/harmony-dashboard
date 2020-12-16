<template>
  <div class="tokenview-page explorer-page page">
    <div class="tokenview-body">
      <div v-if="!loading" class="container">
        <div class="explorer-card">
          <header>
            <div class="token-view-header">
              HRC20 Tokens
            </div>
            <div class="row-select-container">
              Show
              <select v-model="pageSize" class="row-select">
                <option
                  v-for="(row, index) in rowList"
                  :key="index"
                  :value="row"
                >
                  {{ row }}
                </option>
              </select>
              rows
            </div>
            <div class="search">
              <font-awesome-icon class="search-icon" icon="search" />
              <input
                v-model="search"
                type="text"
                placeholder="Search tokens by name/symbol/address"
              />
            </div>
            <div class="pagination-controls">
              <span class="total-tx-num">{{ tokenLength }} tokens</span>
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
                    {{ pageIndex + 1 }} / {{ pageCount ? pageCount : 1 }}
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
            <table v-if="filteredTokens.length" class="explorer-table">
              <tr>
                <th>#</th>
                <th>Token</th>
                <th>Symbol</th>
                <th>Address</th>
                <th>Total Supply</th>
              </tr>
              <tr v-for="(token, index) in tokens" :key="index">
                <td>
                  {{ index + 1 + pageIndex * pageSize }}
                </td>
                <td>
                  <router-link :to="'/address/' + token.contractAddress">
                    {{ token.name }}
                  </router-link>
                </td>
                <td>
                  <span class="ticker">{{ token.symbol }}</span>
                </td>
                <td>
                  {{ token.contractAddress }}
                </td>
                <td>
                  {{ totalSupply(token) }}
                </td>
              </tr>
            </table>

            <div v-else class="no-token-container">
              No tokens found
            </div>
          </div>
        </div>
      </div>
      <div v-else class="container">
        <loading-message />
      </div>
    </div>
  </div>
</template>
<script>
import { HRC20LIST_URL } from '../explorer/store'
import axios from 'axios'
import LoadingMessage from './LoadingMessage'
import { displayAmount } from '@/utils/displayAmount'
import _ from 'lodash'

export default {
  components: {
    LoadingMessage,
  },
  data: () => ({
    pageIndex: 0,
    pageSize: 50,
    rowList: [10, 20, 50, 100, 1000],
    tokenList: [],
    loading: false,
    search: '',
  }),
  computed: {
    tokenLength() {
      return this.filteredTokens.length
    },
    filteredTokens() {
      const filteredTokens = this.tokenList.filter(elem => {
        return (
            (elem.name || '').toLowerCase().includes(this.search.toLowerCase()) ||
            (elem.symbol || '').toLowerCase().includes(this.search.toLowerCase()) ||
            (elem.contractAddress || '').toLowerCase().includes(this.search.toLowerCase())
        )
      })
      return filteredTokens
    },
    tokens() {
      const begin = this.pageIndex * this.pageSize
      return this.filteredTokens.slice(begin, begin + this.pageSize)
    },
    pageCount() {
      return Math.ceil(this.filteredTokens.length / this.pageSize)
    },
  },
  watch: {
    search() {
      this.pageIndex = 0
    },
    pageSize() {
      if (this.pageIndex * this.pageSize > this.filteredTokens.length)
        this.pageIndex = parseInt(this.filteredTokens.length / this.pageSize)
    },
  },
  async created() {
    this.loading = true
    const { data: tokens } = await axios.get(HRC20LIST_URL)
    this.tokenList = _.uniqBy(tokens, 'contractAddress')
    this.loading = false
  },
  methods: {
    totalSupply(token) {
      return displayAmount(token.totalSupply, token.decimals)
    },
    prev() {
      this.pageIndex = Math.max(0, this.pageIndex - 1)
    },
    next() {
      this.pageIndex = Math.min(this.pageCount, this.pageIndex + 1)
    },
    first() {
      this.pageIndex = 0
    },
    last() {
      this.pageIndex = this.pageCount
    },
  },
}
</script>
<style scoped lang="less">
@import '../less/common.less';
.token-view-header {
  flex-grow: 1;
  flex-direction: row;
  justify-content: flex-start;
}
.ticker {
  color: rgb(146, 109, 255);
}
.tokenview-page {
  header {
    align-items: center;
  }
  .row-select-container {
    margin: 0 10px;
    .row-select {
      outline: none;
      border: 1px solid #ddd;
      border-radius: 0;
      &:focus {
        box-shadow: none;
      }
    }
  }
  .search {
    padding: 2px 10px;
    border: 1px solid #eee;
    margin-right: 1rem;
  }
  input {
    border: none;
    width: 250px;
    outline: none;
    background: transparent;
    color: black;
    &:focus {
      box-shadow: none;
    }
  }
}
</style>
