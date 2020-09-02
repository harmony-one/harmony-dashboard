<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="blocks-page explorer-page page">
    <div class="blocks-body explorer-body">
      <div class="container">
        <div class="explorer-card">
          <header>
            <h1 class="flex-grow">
              Blocks
            </h1>
            <div class="pagination-controls">
              <span class="total-block-num">
                {{ globalData.blockCount }} blocks
              </span>
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
                <!-- <span class="page-size-controller">
                  <select v-model="pageSize">
                    <option v-for="val in [10, 25, 50, 100]" :key="val">{{ val }}</option>
                  </select>
                  items / page
                </span>-->
              </span>
            </div>
          </header>
          <div class="explorer-card-body">
            <table v-if="blocks.length" class="explorer-table">
              <tr>
                <th>Shard</th>
                <th>Hash</th>
                <th>Height</th>
                <th>Timestamp</th>
                <th>Age</th>
                <!-- <th class="text-right">Transactions</th> -->
                <th class="text-right">
                  Size (bytes)
                </th>
              </tr>
              <tr v-for="block in blocks" :key="block.id" class="container">
                <td>
                  <!-- <router-link :to="'/shard/' + block.shardID"> -->
                  {{ block.shardID }}
                  <!-- </router-link> -->
                </td>
                <td>
                  <router-link :to="'/block/' + block.id">
                    {{ block.id | shorten }}
                  </router-link>
                </td>
                <td>
                  <router-link :to="'/block/' + block.id">
                    {{ block.height }}
                  </router-link>
                </td>
                <td>{{ block.timestamp | timestamp }}</td>
                <td>{{ block.timestamp | age }}</td>
                <td class="text-right">
                  {{ block.txCount }}
                </td>
                <td class="text-right">
                  {{ block.stakingTxCount }}
                </td>
                <td class="text-right">
                  {{ block.bytes }}
                </td>
              </tr>
            </table>

            <div v-else>
              <loading-message />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../explorer/store'
import service from '../explorer/service'
import LoadingMessage from './LoadingMessage'

export default {
  name: 'BlocksPage',
  components: {
    LoadingMessage,
  },
  data() {
    return {
      globalData: store.data,
      blocks: [],
      pageIndex: 0,
      pageSize: 50,
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.globalData.blockCount / this.pageSize)
    },
  },
  watch: {
    $route(to) {
      this.pageIndex = (+to.params.pageIndex || 1) - 1
      this.getBlocks()
    },
  },
  mounted() {
    if (this.$route.params.pageIndex) {
      this.pageIndex = +this.$route.params.pageIndex - 1
    }
    this.getBlocks()
  },
  methods: {
    goToPage(index) {
      if (index < 0) index = 0
      if (index >= this.pageCount) index = this.pageCount - 1
      this.$router.replace({
        name: 'BlocksPage',
        params: { pageIndex: index + 1 },
      })
    },
    first() {
      this.goToPage(0)
    },
    last() {
      this.goToPage(this.pageCount - 1)
    },
    prev() {
      if (this.pageIndex === 0) return
      this.goToPage(this.pageIndex - 1)
    },
    next() {
      if (this.pageIndex === this.pageCount - 1) return
      this.goToPage(this.pageIndex + 1)
    },
    getBlocks() {
      this.blocks = []
      service.getBlocks(this.pageIndex, this.pageSize).then(blocks => {
        this.blocks = blocks
      })
    },
  },
}
</script>
