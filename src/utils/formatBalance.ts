import BigNumber from 'bignumber.js'

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

export const getDisplayBalance = (balance: BigNumber, decimals = 18) => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
  const displayDecimals = 4;
  return parseFloat(displayBalance.toFixed(displayDecimals, 1)).toLocaleString(undefined, { maximumFractionDigits: displayDecimals, minimumFractionDigits: displayDecimals })
}

export const toNumber = (balance: any, decimals = 18) => {
  const displayBalance = new BigNumber(balance.toString()).dividedBy(new BigNumber(10).pow(decimals))  
  return displayBalance.toNumber()
}

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed()
}
