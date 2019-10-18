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
        avgBlockLatency: null,
        lastUpdateTime: null
    },
    update(data) {
        let blocks = data.blocks;
        // don't add blocks that are already in latestBlocks
        let blockMap = {};
        this.data.latestBlocks.forEach(b => blockMap[b.id] = b);
        Object.keys(blocks).forEach(shardId => {
            blocks[shardId].forEach(b =>  blockMap[b.id] = b);
        });
        this.data.latestBlocks = Object.values(blockMap).sort((a, b) => b.timestamp - a.timestamp).slice(0, MaxLatestBlockCount);
        this.data.blockCount = data.blockCount;
        this.data.txCount = data.txCount;
        this.data.shardCount = data.shardCount;

        let txs = data.txs;
        // don't add txs that are already in latestTxs
        let txMap = {};
        this.data.latestTxs.forEach(t => txMap[t.id] = t);
        Object.keys(txs).forEach(shardId => {
            txs[shardId].forEach(tx => txMap[tx.id] = tx);
        });
        this.data.latestTxs = Object.values(txMap).sort((a, b) => b.timestamp - a.timestamp).slice(0, MaxLatestTxCount);

        this.data.blockLatencies = data.blockLatencies;
        let latencies = Object.values(data.blockLatencies).filter(x => Number.isFinite(x));
        if (latencies.length) {
            this.data.avgBlockLatency = latencies.reduce((memo, x) => memo + x, 0) / latencies.length;
        }

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