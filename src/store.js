import Vue from 'vue';

let store = {
    data: {
        shardSummaries: {}
    },
    updateSummaries(summaries) {
        Object.values(summaries).forEach(summary => {
            Vue.set(this.data.shardSummaries, summary.key, summary);
        });
    }
};

export default store;