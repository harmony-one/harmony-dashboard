import Vue from 'vue';

let store = {
    data: {
        blockMap: {}, // shardID to block
        blocks: [] // all block merged in one array sorted by time stamp
    },
    setBlocks(blocks) {
        Vue.set(this.data, 'blockMap', blocks);
        let merged = Object.keys(blocks).reduce((prev, cur) => prev.concat(blocks[cur]), []);
        console.log(merged.length);
        Vue.set(this.data, 'blocks', merged);
    }
};

export default store;