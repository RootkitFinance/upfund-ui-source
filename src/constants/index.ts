import { AbstractConnector } from "@web3-react/abstract-connector"

import { injected, walletconnect, walletlink } from "../connectors"
import { TokenInfo } from "../dtos/TokenInfo"

export const NETWORK_LABELS: { [chainId in number]?: string } = {
  1: "Ethereum",  
  56: "Binance",
  137: "Matic"
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
  [Token.upTether, 137],
  [Token.upBNB, 56],
])

export const baseTickers = new Map([
  [Token.ROOT, "WETH"],
  [Token.upTether, "USDT"],
  [Token.upBNB, "wBNB"],
])

export const eliteTickers = new Map([
  [Token.ROOT, "KETH"],
  [Token.upTether, "eUSDT"],
  [Token.upBNB, "eBNB"],
])

export const rootedTickers = new Map([
  [Token.ROOT, "ROOT"],
  [Token.upTether, "upUSDT"],
  [Token.upBNB, "upBNB"],
])

export const baseAddresses = new Map([
  [Token.ROOT, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
  [Token.upTether, "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"],
  [Token.upBNB, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"],
])

export const eliteAddresses = new Map([
  [Token.ROOT, "0x93747501F46Ae40b8A4B8F1a1529696AE24ea04e"],
  [Token.upTether, "0xbFDF833E65Bd8B27c84fbE55DD17F7648C532168"],
  [Token.upBNB, "0xb7db0850096aeaec1b615463202db441012c564f"],
])

export const rootedAddresses = new Map([
  [Token.ROOT, "0xcb5f72d37685c3d5ad0bb5f982443bc8fcdf570e"],
  [Token.upTether, "0xCb5f72d37685C3D5aD0bB5F982443BC8FcdF570E"],
  [Token.upBNB, "0x1759254EB142bcF0175347D5A0f3c19235538a9A"],
])

export const stakingAddresses = new Map([
  [Token.upTether, "0xc328f44ecaCE72cdeBc3e8E86E6705604BE2d2e1"],
  [Token.upBNB, "0x49Ba5c83F151F8f786CF2623243b66dC42492d41"],
])

export const basePoolAddresses = new Map([
  [Token.ROOT, "0x01f8989c1e556f5c89c7d46786db98eeaae82c33"],
  [Token.upBNB, "0x27d078b13C2239606783679895Ec3b164da24D90"],
])

export const elitePoolAddresses = new Map([
  [Token.ROOT, "0x44ee37ba8c98493f2590811c197ddd474c911d46"],
  [Token.upTether, "0x50db5be8c0c878e28fe231c647ef41b395463ffb"],
  [Token.upBNB, "0x0C51ec4743C1ae6be3c193926BA04458A56e4437"],
])

export const liquidityControllerAddresses = new Map([
  [Token.ROOT, "0x424eE0bA90c1B07A7c8A1A38aE999a88ED2cA5D1"],
  [Token.upTether, "0x4C66a6f06B8bC4243479121A4eF0061650e5D137"],
  [Token.upBNB, "0xd22F3E99F7e16566A104A47c9c15e97C6B4Ad122"],
])

export const calculatorAddresses = new Map([
  [Token.ROOT, "0xA12C55637E642C0e79C5923125cd7eeb8be3a53F"],
  [Token.upTether, "0xdc436261C356E136b1671442d0bD0Ae183a6d77D"],
  [Token.upBNB, "0x2Cf93f951C44980Fb1790524d4f1a32A5dC7dadC"],
])

export const transfetGateAddresses = new Map([
  [Token.ROOT, "0x105E66f0bfD5b3b1E386D0dC6EC00F3342EF3fF6"],
  [Token.upTether, "0x621642243CC6bE2D18b451e2386c52d1e9f7eDF6"],
  [Token.upBNB, "0x41491742c5b9FcA5963Efde67Cfd8a9a2205CdFb"],
])

export const feeSplitterAddresses = new Map([
  [Token.upTether, "0x1df2099f6AbBf0b05C12a61835137D84F10DAA96"],
  [Token.upBNB, "0x26d24c05798595395173C12b409E349ef888f222"],
])


export const arbitrageAddresses = new Map([
  [Token.ROOT, ""],
  [Token.upBNB, ""],
])

export const routerAddresses = new Map([
  [Token.ROOT, "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"],
  [Token.upTether, "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"],
  [Token.upBNB, "0x10ed43c718714eb63d5aa57b78b54704e256024e"],
])

export const factoryAddresses = new Map([
  [Token.ROOT, "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"],
  [Token.upTether, "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"],
  [Token.upBNB, "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"],
])


export const rootedRouterAddresses = new Map([
  [Token.upTether, "0x04A2fAB8dD40EEE62A12ce8692853e291ddbF54A"]
])




export const rootedTokenInBasePool = new Map([
  [Token.ROOT, 1],
  [Token.upTether, 1],
  [Token.upBNB, 0],
])

export const VAULT_ADDRESS = "0xaa360Bd89Ac14533940114cf7205DdF5e0CA7fa6"
export const IGNORE_ADDRESS = "0x4D605Ded7e5a9B22ecB8B90576Cd9b405190C1EB"
export const BUY_BACK_ADDRESS = "0xc27c10ABf2fD6B39Cda4c5478BB2BF1E12919c99"
export const DEPLOYER_ADDRESS = "0x804CC8D469483d202c69752ce0304F71ae14ABdf"
export const ROOT_FEEDER_ADDRESS = "0xc27c10ABf2fD6B39Cda4c5478BB2BF1E12919c99"
export const DEV_FEEDER_ADDRESS = "0x30d1db7f73C7f9819e0676F5052D3B2D45FF3Fe5"
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
export const ETetherToken = new TokenInfo("eUSDT", eliteAddresses.get(Token.upTether)!, 6);
export const UpTetherToken = new TokenInfo("upUSDT", rootedAddresses.get(Token.upTether)!);
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
  if (address === ETetherLpToken.address) return ETetherLpToken
 
  if (address === BnbToken.address) return BnbToken
  if (address === EBnbToken.address) return EBnbToken
  if (address === UpBnbToken.address) return UpBnbToken
  if (address === BnbLpToken.address) return BnbLpToken
  if (address === EBnbLpToken.address) return EBnbLpToken

  return undefined
}