export function formatDecimal(number) {
    return formatNumber((+number).toFixed(2));
}

export function formatNumber(number) {
    return (+number).toLocaleString()
}

export function shortenHash(hash) {
    if (!hash || hash.length <= 10) return hash;
    return hash.substr(0, 5) + "..." + hash.substr(hash.length - 5);
}