import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { NetworkConnector } from './NetworkConnector'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL!

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1');

export const NETWORK_URLS: { [key in number]: string } = {
  [1]:"https://mainnet.infura.io/v3/11c990cbd8d3486397e398470aaf124a",
  [56]: "https://speedy-nodes-nyc.moralis.io/1aa4d3cb15f8ba2db24211d7/bsc/mainnet",
  [137]: "https://polygon-mainnet.infura.io/v3/f7d60406acb14e3d996b21eb33d74403",
  [25]:"https://cronos.nodes.cybercorey.net"
}

export const network = new NetworkConnector({
    urls: NETWORK_URLS
  })

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

const supportedChainIds = [1, 56, 137, 43114, 25]

export const injected = new InjectedConnector({
  supportedChainIds: supportedChainIds
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: NETWORK_URLS, // Infura URL does not work 
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  supportedChainIds: supportedChainIds,
})


// mainnet only
export const walletlink = new WalletLinkConnector({
    url: NETWORK_URL,
    appName: 'upFund',
    appLogoUrl:
      'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
  })
