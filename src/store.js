import Vue from 'vue';

let store = {
    data: {
        shardSummaries: {},
        globalSummary: {}
    },
    updateSummaries(summaries) {
        Object.values(summaries).forEach(summary => {
            Vue.set(this.data.shardSummaries, summary.key, summary);
        });
        // Update global summary
        let globalSummary = {
            tps: 0,
            txCount: 0,
            blockCount: 0,
            nodeCount: 0,
            avgBlockLatency: 0
        };
        Object.values(this.data.shardSummaries).forEach((summary) => {
            globalSummary.tps += +summary.tps;
            globalSummary.txCount += summary.txCount;
            globalSummary.blockCount += summary.blockCount;
            globalSummary.nodeCount += summary.nodeCount;
            globalSummary.avgBlockLatency += summary.blockLatency;
        });
        globalSummary.avgBlockLatency /= Object.keys(this.data.shardSummaries).length;
        this.data.globalSummary = Object.assign({}, globalSummary);
    }
};

export default store;