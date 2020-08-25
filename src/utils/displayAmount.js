import BigNumber from "bignumber.js"

export const displayAmount = (amount, decimals) => {
    const a = new BigNumber(10).pow(decimals)
    const num = new BigNumber(amount).div(a)

    const res =  num.toFormat(decimals)
    return res
}