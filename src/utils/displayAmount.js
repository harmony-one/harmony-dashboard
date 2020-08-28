import BigNumber from 'bignumber.js'

BigNumber.config({ EXPONENTIAL_AT: [-20, 20] })

export const displayAmount = (
  amount,
  decimals = 0,
  showDecimalsFully = false
) => {
  const a = new BigNumber(10).pow(decimals)
  const num = new BigNumber(amount).div(a)

  console.log({ amount, num: num.toString(), decimals }, amount.toString())
  if (!showDecimalsFully) {
    return num.toString()
  }

  return num.toFormat(decimals)
}
