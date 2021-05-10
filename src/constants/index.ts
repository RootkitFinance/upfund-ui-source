import { AbstractConnector } from "@web3-react/abstract-connector"

import { injected, walletconnect, walletlink } from "../connectors"
import { TokenInfo } from "../dtos/TokenInfo"

export const NETWORK_LABELS: { [chainId in number]?: string } = {
  1: "Ethereum",  
  3: "Ropsten",
  4: "Rinkeby",
  5: "Görli",
  42: "Kovan",
  56: "Binance"
}

export enum Token {
  ROOT,
  upTether,
  upBNB
}

export const baseDecimals = new Map([
  [Token.ROOT, 18],
  [Token.upTether, 6],
  [Token.upBNB, 18],
])

export const tokenChains = new Map([
  [Token.ROOT, 1],
  [Token.upTether, 1],
  [Token.upBNB, 56],
])

export const baseTickers = new Map([
  [Token.ROOT, "WETH"],
  [Token.upTether, "USDT"],
  [Token.upBNB, "wBNB"],
])

export const eliteTickers = new Map([
  [Token.ROOT, "KETH"],
  [Token.upTether, "etTether"],
  [Token.upBNB, "eBNB"],
])

export const rootedTickers = new Map([
  [Token.ROOT, "ROOT"],
  [Token.upTether, "upUSDT"],
  [Token.upBNB, "upBNB"],
])

export const baseAddresses = new Map([
  [Token.ROOT, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
  [Token.upTether, "0xdac17f958d2ee523a2206206994597c13d831ec7"],
  [Token.upBNB, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"],
])

export const eliteAddresses = new Map([
  [Token.ROOT, "0x93747501F46Ae40b8A4B8F1a1529696AE24ea04e"],
  [Token.upTether, "0x68D21265f815090B8Ab47B615753bB707D8C8636"],
  [Token.upBNB, "0xb7db0850096aeaec1b615463202db441012c564f"],
])

export const rootedAddresses = new Map([
  [Token.ROOT, "0xcb5f72d37685c3d5ad0bb5f982443bc8fcdf570e"],
  [Token.upTether, "0x49D30E666E88c1a18F6cd9aDa5d138D0d3780858"],
  [Token.upBNB, "0x9c3bbff333f4aeab60b3c060607b7c505ff30c82"],
])

export const basePoolAddresses = new Map([
  [Token.ROOT, "0x01f8989c1e556f5c89c7d46786db98eeaae82c33"],
  [Token.upTether, "0x75651cDcceaC34204C27a74a9267F538F0a387E8"],
  [Token.upBNB, "0xb7b3852904aB78cCF76459bb28F160589C530688"],
])

export const elitePoolAddresses = new Map([
  [Token.ROOT, "0x44ee37ba8c98493f2590811c197ddd474c911d46"],
  [Token.upTether, "0x13574cA3ec622b7E9E8fD29B5D0C8Dd6a6694d9a"],
  [Token.upBNB, "0x624b117c68de2d2524fde8c5fb7497d4aabf4bf4"],
])

export const liquidityControllerAddresses = new Map([
  [Token.ROOT, "0x424eE0bA90c1B07A7c8A1A38aE999a88ED2cA5D1"],
  [Token.upTether, "0xcBF6eBBF8EC2AB0c9F1CFd257faD6678b0526e16"],
  [Token.upBNB, "0x09761A4D96F5dB4dB6425FA3acB3b3D27cB8b0e9"],
])

export const calculatorAddresses = new Map([
  [Token.ROOT, "0xD4ed41a41bD5114341Eb2Dd066BD7A927B98DC14"],
  [Token.upTether, "0xB0cC4A9Fe546ad78ee0E080Bf5c4E15112176222"],
  [Token.upBNB, "0xc129d4BaEF42C4DCF03D48e9A484F72E33f4f376"],
])

export const transfetGateAddresses = new Map([
  [Token.ROOT, "0x105E66f0bfD5b3b1E386D0dC6EC00F3342EF3fF6"],
  [Token.upTether, "0x5Db891E2f256E690aeD79bb2Fe94675bEf1435c5"],
  [Token.upBNB, "0xDDDe5C5d1285428922bb2f8524dD1C117A3Bf313"],
])

export const rootedTokenInBasePool = new Map([
  [Token.ROOT, 1],
  [Token.upTether, 0],
  [Token.upBNB, 0],
])

export const VAULT_ADDRESS = "0xaa360Bd89Ac14533940114cf7205DdF5e0CA7fa6"
export const IGNORE_ADDRESS = "0x4D605Ded7e5a9B22ecB8B90576Cd9b405190C1EB"
export const BUY_BACK_ADDRESS = "0xc27c10ABf2fD6B39Cda4c5478BB2BF1E12919c99"
export const DEPLOYER_ADDRESS = "0x804CC8D469483d202c69752ce0304F71ae14ABdf"
export const TWO_POOL_CALCULATOR_ADDRESS = "0xD4ed41a41bD5114341Eb2Dd066BD7A927B98DC14"
export const MONEY_BUTTON_ADDRESS = "0x7803B983492EB76406BDbF222D77937198ABa03c"
export const TRANSFER_GATE_ADDRESS = "0x12b0CC3C0DC7E4d525db490f24Dd4B3526820C50"
export const RUGGABLE_FLOOR_CALCULATOR_ADDRESS = "0x8caa383A22f2335f30cEe83c5dED3A91c8Af53a3"

export const ROOT_ADDRESS = "0xcb5f72d37685c3d5ad0bb5f982443bc8fcdf570e"
export const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
export const KETH_ADDRESS = "0x93747501F46Ae40b8A4B8F1a1529696AE24ea04e"
export const WRAPPED_KETH_ROOT_LP_ADDRESS = "0xBfBb9B401114e367f7E174cDF4FBb8Fcc0585fcc"
export const WRAPPED_WETH_ROOT_LP_ADDRESS = "0x12a06769C5a8881aafb4eA0F6D8b7Ad79EaEBc35"

export const WETH_ROOT_POOL_ADDRESS = "0x01f8989c1e556f5c89c7d46786db98eeaae82c33"
export const KETH_ROOT_POOL_ADDRESS = "0x44ee37ba8c98493f2590811c197ddd474c911d46"

export interface WalletInfo {
    connector?: AbstractConnector
    name: string
    iconName: string
    description: string
    href: string | null
    color: string
    primary?: true
    mobile?: true
    mobileOnly?: true
  }

  export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    INJECTED: {
      connector: injected,
      name: "Injected",
      iconName: "arrow-right.svg",
      description: "Injected web3 provider.",
      href: null,
      color: "#010101",
      primary: true
    },
    METAMASK: {
      connector: injected,
      name: "MetaMask",
      iconName: "metamask.png",
      description: "Easy-to-use browser extension.",
      href: null,
      color: "#E8831D"
    },
    WALLET_CONNECT: {
      connector: walletconnect,
      name: "WalletConnect",
      iconName: "walletConnectIcon.svg",
      description: "Connect to Trust Wallet, Rainbow Wallet and more...",
      href: null,
      color: "#4196FC",
      mobile: true
    },
    WALLET_LINK: {
      connector: walletlink,
      name: "Coinbase Wallet",
      iconName: "coinbaseWalletIcon.svg",
      description: "Use Coinbase Wallet app on mobile device",
      href: null,
      color: "#315CF5"
    },
    COINBASE_LINK: {
      name: "Open in Coinbase Wallet",
      iconName: "coinbaseWalletIcon.svg",
      description: "Open in Coinbase Wallet app.",
      href: "https://go.cb-w.com/mtUDhEZPy1",
      color: "#315CF5",
      mobile: true,
      mobileOnly: true
    }
  }

export const NetworkContextName = "NETWORK"  

export const WethToken = new TokenInfo("WETH", WETH_ADDRESS);
export const KethToken = new TokenInfo("KETH", KETH_ADDRESS);
export const RootToken = new TokenInfo("ROOT", ROOT_ADDRESS);
export const WethRootLpToken = new TokenInfo("WETH LP", WETH_ROOT_POOL_ADDRESS);
export const KethRootLpToken = new TokenInfo("KETH LP", KETH_ROOT_POOL_ADDRESS);
export const WrappedWethRootLpToken = new TokenInfo("Wrapped WETH LP", WRAPPED_WETH_ROOT_LP_ADDRESS);
export const WrappedKethRootLpToken = new TokenInfo("Wrapped KETH LP", WRAPPED_KETH_ROOT_LP_ADDRESS);


export const TetherToken = new TokenInfo("USDT", baseAddresses.get(Token.upTether)!, 6);
export const ETetherToken = new TokenInfo("etTether", eliteAddresses.get(Token.upTether)!, 6);
export const UpTetherToken = new TokenInfo("upUSDT", rootedAddresses.get(Token.upTether)!);
export const TetherLpToken = new TokenInfo("USDT LP", basePoolAddresses.get(Token.upTether)!);
export const ETetherLpToken = new TokenInfo("eUSDT LP", elitePoolAddresses.get(Token.upTether)!);


export const BnbToken = new TokenInfo("BNB", baseAddresses.get(Token.upBNB)!);
export const EBnbToken = new TokenInfo("eBNB", eliteAddresses.get(Token.upBNB)!);
export const UpBnbToken = new TokenInfo("upBNB", rootedAddresses.get(Token.upBNB)!);
export const BnbLpToken = new TokenInfo("BNB LP", basePoolAddresses.get(Token.upBNB)!);
export const EBnbLpToken = new TokenInfo("eBNB LP", elitePoolAddresses.get(Token.upBNB)!);

export const getTokenByAddress = (address: string) => { 
  if (address === WethToken.address) return WethToken
  if (address === KethToken.address) return KethToken
  if (address === RootToken.address) return RootToken
 
  if (address === WethRootLpToken.address) return WethRootLpToken
  if (address === KethRootLpToken.address) return KethRootLpToken
 
  if (address === WrappedWethRootLpToken.address) return WrappedWethRootLpToken
  if (address === WrappedKethRootLpToken.address) return WrappedKethRootLpToken

  if (address === TetherToken.address) return TetherToken
  if (address === ETetherToken.address) return ETetherToken
  if (address === UpTetherToken.address) return UpTetherToken
  if (address === TetherLpToken.address) return TetherLpToken
  if (address === ETetherLpToken.address) return ETetherLpToken

  if (address === BnbToken.address) return BnbToken
  if (address === EBnbToken.address) return EBnbToken
  if (address === UpBnbToken.address) return UpBnbToken
  if (address === BnbLpToken.address) return BnbLpToken
  if (address === EBnbLpToken.address) return EBnbLpToken

  return undefined
}