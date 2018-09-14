import Vue from 'vue';

class GlobalSummary {
    tps = 0;
    txCount = 0;
    blockCount = 0;
    nodeCount = 0;
    avgBlockLatency = 0;
    shardCount = 0;
    constructor(shardSummaries) {
        let keys = Object.keys(shardSummaries);
        keys.forEach((key) => {
            let summary = shardSummaries[key];
            this.tps += summary.tps;
            this.txCount += summary.txCount;
            this.blockCount += summary.blockCount;
            this.nodeCount += summary.nodeCount;
            this.avgBlockLatency += summary.blockLatency;
        });
        this.avgBlockLatency /= keys.length;
        this.shardCount = keys.length
    }
}

let store = {
    data: {
        shardSummaries: {},
        globalSummary: {}
    },
    reset() {
        this.data.shardSummaries = {};
        this.globalSummary = {};
    },
    update(data) {
        Object.values(data.shardSummaries).forEach(summary => {
            Vue.set(this.data.shardSummaries, summary.key, summary);
        });

        let globalSummary = new GlobalSummary(this.data.shardSummaries);
        this.data.globalSummary = Object.assign({}, globalSummary);
    }
};

export default store;