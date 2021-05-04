import { getAddress } from '@ethersproject/address'
import { Token, tokenChains } from '../constants'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

const ETHERSCAN_PREFIXES: { [chainId in number]: string } = {
  1: 'etherscan.io',
  3: 'ropsten.etherscan.io',
  4: 'rinkeby.etherscan.io',
  5: 'goerli.etherscan.io',
  42: 'kovan.etherscan.io',
  56: 'bscscan.com',
}

export function getEtherscanLink(
  chainId: number,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export const getEtherscanLabel = (chainId: number) => `View on ${ chainId === 56 ? 'Bscscan' : 'Etherscan' }`

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export const getMaxAmount = (balance: number) => {
  // used to ensure the user doesn't send so much ETH so they end up with <.01
  const minEth = 0.01
  return balance <= minEth ? 0 : balance - minEth
}

export const supportedChain = (chainId: number, token: Token) => {
  return chainId === tokenChains.get(token)
}

const  gasMultiplier: number = 1.25
export const calculateGas = (estimatedGas: number) => Math.round(estimatedGas * gasMultiplier)

