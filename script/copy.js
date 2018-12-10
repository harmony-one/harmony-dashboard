// https://blockexplorer.com/blocks
copy($$('.fader.ng-scope').map(x => {
    let b = {};
    b.id = $('a', x).href.replace('https://blockexplorer.com/block/', '');
    b.height = $('td:nth-child(1)', x).textContent;
    b.timestamp = $('td:nth-child(2)', x).textContent;
    b.txCount = $('td:nth-child(3)', x).textContent;
    b.size = $('td:nth-child(5)', x).textContent;
    return b;
}))

// https://blockexplorer.com/block/0000000000000000001c48da2a21c9d098efcab0f4904ff4773c0896c63c62f8
copy((function() {
    var block = {};
    block.height = $('h1').textContent.replace('Block #', '');
    block.hash = $('#wrap > section > section > div:nth-child(3) > div.well.well-sm.ellipsis > span.txid.text-muted.ng-binding').textContent;
    block.txCount = $('#wrap > section > section > div:nth-child(3) > div.row > div:nth-child(1) > table > tbody > tr:nth-child(1) > td.text-right.text-muted.ng-binding').textContent;
    block.timestamp = $('#wrap > section > section > div:nth-child(3) > div.row > div:nth-child(1) > table > tbody > tr:nth-child(4) > td.text-right.text-muted.ng-binding').textContent;
    block.merkleRoot = $('#wrap > section > section > div:nth-child(3) > div.row > div:nth-child(1) > table > tbody > tr:nth-child(6) > td.text-right.text-muted > div > span.ng-binding').textContent;
    var prevBlock = $('#wrap > section > section > div:nth-child(3) > div.row > div:nth-child(1) > table > tbody > tr:nth-child(7) > td.text-right > a');
    block.prevBlock = {
        id: prevBlock.href.replace('https://blockexplorer.com/block/', ''),
        height: prevBlock.textContent
    };
    block.bits = $('#wrap > section > section > div:nth-child(3) > div.row > div:nth-child(2) > table > tbody > tr:nth-child(2) > td.text-right.text-muted.ng-binding').textContent;
    block.bytes = $('#wrap > section > section > div:nth-child(3) > div.row > div:nth-child(2) > table > tbody > tr:nth-child(3) > td.text-right.text-muted.ng-binding').textContent;
    var nextBlock = $('#wrap > section > section > div:nth-child(3) > div.row > div:nth-child(2) > table > tbody > tr:nth-child(6) > td.text-right > a');
    block.nextBlock = {
        id: nextBlock.href.replace('https://blockexplorer.com/block/', ''),
        height: nextBlock.textContent
    }
    return block;
})())

// https://blockexplorer.com/tx/a72efb891bc24cfeecf78d59a0a1672b593eaf486684e01a3883c7daa27d7684
copy((function () {
    var tx = {};
    tx.hash = $('#wrap > section > section > div:nth-child(3) > div:nth-child(2) > div > span.txid.text-muted.ng-binding').textContent;
    tx.bytes = $('#wrap > section > section > div:nth-child(3) > div:nth-child(2) > table > tbody > tr:nth-child(1) > td.text-muted.text-right.ng-binding').textContent.replace(' (bytes)', '');
    tx.receivedTime = $('#wrap > section > section > div:nth-child(3) > div:nth-child(2) > table > tbody > tr:nth-child(3) > td.text-muted.text-right.ng-binding').textContent;
    tx.minedTime = $('#wrap > section > section > div:nth-child(3) > div:nth-child(2) > table > tbody > tr:nth-child(4) > td.text-muted.text-right.ng-binding').textContent;
    tx.block = $('#wrap > section > section > div:nth-child(3) > div:nth-child(2) > table > tbody > tr:nth-child(5) > td:nth-child(2) > div > a').textContent
    tx.coinbase = $('#wrap > section > section > div:nth-child(3) > div:nth-child(2) > table > tbody > tr:nth-child(7) > td.text-muted.text-right > div > span.ng-binding').textContent;
    return tx;
}()))