import BigNumber from 'bignumber.js'

BigNumber.config({ EXPONENTIAL_AT: [-20, 20], DECIMAL_PLACES: 18 })

export const displayAmount = (
  amount,
  decimals = 0,
  showDecimalsFully = false
) => {
  const a = new BigNumber(10).pow(decimals)
  const num = new BigNumber(amount).div(a)

  if (!showDecimalsFully) {
    return num.toNumber().toString() //.toString() //.toPrecision(decimals)
  }

  return num.toFormat(decimals)
}
