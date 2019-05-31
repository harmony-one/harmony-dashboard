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

        this.data.lastUpdateTime = data.lastUpdateTime;
    },
    updateNodeCount(data) {
        this.data.nodeCount = data.nodeCount;
    },
    updateNodes(data) {
        this.data.nodes = data.nodes;
    },
    reset() {
        this.data.blockMap = {};
        this.data.blocks = [];
        this.data.lastUpdateTime = null;
    }
};

export default store;