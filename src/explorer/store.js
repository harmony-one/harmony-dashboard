import Vue from 'vue';

let store = {
    data: {
        blockMap: {}, // shardID to block
        blocks: [], // all block merged in one array sorted by time stamp
        lastUpdateTime: null
    },
    update(data) {
        let blocks = data.blocks;
        blocks.forEach((shardBlocks, i) => {
            if (!this.data.blockMap[i]) {
                Vue.set(this.data.blockMap, i, []);
            }
            let target = this.data.blockMap[i];
            target.splice(target.length, 0, ...shardBlocks);
        });
        let merged = Object.keys(this.data.blockMap)
            .reduce((prev, cur) => prev.concat(this.data.blockMap[cur]), [])
            .sort((a, b) => b.timestamp - a.timestamp);
        // console.log(merged, merged.length);
        Vue.set(this.data, 'blocks', merged);
        this.data.lastUpdateTime = data.lastUpdateTime;
    },
    reset() {
        this.data.blockMap = {};
        this.data.blocks = [];
        this.data.lastUpdateTime = null;
    }
};

export default store;