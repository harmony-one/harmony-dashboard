export function formatDecimal(number) {
    return formatNumber((+number).toFixed(2));
}

export function formatNumber(number) {
    return (+number).toLocaleString()
}