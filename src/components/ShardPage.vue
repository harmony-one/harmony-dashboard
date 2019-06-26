<style scoped lang="less">
@import "../less/common.less";
</style>

<template>
  <div class="shard-page explorer-page page">
    <div class="shard-body explorer-body">
      <div class="container" v-if="!loading">
        <div class="explorer-card">
          <header>
            <h1 class="flex-grow">Shard {{ id }}</h1>
          </header>
          <div class="explorer-card-body">
            <table class="explorer-table">
              <tr>
                <th>#</th>
                <th>Node ID</th>
              </tr>
              <tr class="container" v-for="(node, i) in shard.nodes" :key="node.id">
                <td class="no-break">{{ i }}</td>
                <td>{{ node.id }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="container" v-else>
        <loading-message/>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import store from "../explorer/store";
import service from "../explorer/service";
import LoadingMessage from "./LoadingMessage";
import moment from "moment";

export default {
  name: "ShardPage",
  data() {
    return {
      loading: true,
      id: "",
      shard: {
        nodes: []
      }
    };
  },
  components: {
    FontAwesomeIcon,
    LoadingMessage
  },
  watch: {
    $route(to, from) {
      this.getShard();
    }
  },
  mounted() {
    this.getShard();
  },
  methods: {
    getShard() {
      this.loading = true;
      this.id = this.$route.params.id;
      service
        .getShard(this.id)
        .then(shard => {
          this.shard = shard;
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>