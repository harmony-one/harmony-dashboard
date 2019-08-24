import Vue from 'vue';

const MaxLatestBlockCount = 10;
const MaxLatestTxCount = 10;
let store = {
    data: {
        latestBlocks: [], // all latest block merged in one array sorted by timestamp
        latestTxs: [], // all latest tx merged in one array sorted by timestamp
        blockCount: 0,
        txCount: 0,
        nodeCount: 0,
        nodes: {},
        shardCount: 0,
        blockLatencies: [], // shardID to blockLatencies
        avgBlockLatency: 0,
        lastUpdateTime: null
    },
    update(data) {
        let blocks = data.blocks;
        let mergedBlocks = Object.keys(blocks)
            .reduce((memo, i) => memo.concat(blocks[i]), [])
            .sort((a, b) => b.timestamp - a.timestamp);
        this.data.latestBlocks = mergedBlocks.concat(this.data.latestBlocks).slice(0, MaxLatestBlockCount);

        this.data.blockCount = data.blockCount;
        this.data.txCount = data.txCount;
        this.data.shardCount = data.shardCount;

        let txs = data.txs;
        let mergedTxs = Object.keys(txs)
            .reduce((memo, i) => memo.concat(txs[i]), [])
            .sort((a, b) => b.timestamp - a.timestamp);
        this.data.latestTxs = mergedTxs.concat(this.data.latestTxs).slice(0, MaxLatestTxCount);
        
        this.data.blockLatencies = data.blockLatencies;
        let latencies = Object.values(data.blockLatencies).filter(x => Number.isFinite(x));
        this.data.avgBlockLatency = latencies.reduce((memo, x) => memo + x, 0) / latencies.length;

        this.data.lastUpdateTime = data.lastUpdateTime;
    },
    updateNodeCount(data) {
        this.data.nodeCount = data.nodeCount;
    },
    updateNodes(data) {
        this.data.nodes = data.nodes;
    },
    reset() {
        // TODO(ricl): avoid dup logic between reset and initial values
        this.data.blockMap = {};
        this.data.blocks = [];
        this.data.lastUpdateTime = null;
        this.data.latestBlocks = [];
        this.data.latestTxs = [];
        this.data.blockCount = 0;
        this.data.txCount = 0;
        this.data.nodeCount = 0;
        this.data.nodes = {};
        this.data.shardCount = 0;
        this.data.blockLatencies = [];
    }
};

export default store;