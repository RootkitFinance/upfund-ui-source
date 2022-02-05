import { AbstractConnector } from "@web3-react/abstract-connector"

import { injected, walletconnect, walletlink } from "../connectors"
import { TokenInfo } from "../dtos/TokenInfo"

export const NETWORK_LABELS: { [chainId in number]?: string } = {
  1: "Ethereum",  
  56: "Binance",
  137: "Matic",
  25: "Cronos"
}

export enum Token {
  ROOT,
  upTether,
  upBNB,
  upMatic,
  upCake,
  upCro
}

export const baseDecimals = new Map([
  [Token.ROOT, 18],
  [Token.upTether, 6],
  [Token.upBNB, 18],
  [Token.upMatic, 18],
  [Token.upCake, 18],
  [Token.upCro, 18],
])

export const tokenChains = new Map([
  [Token.ROOT, 1],
  [Token.upTether, 137],
  [Token.upBNB, 56],
  [Token.upMatic, 137],
  [Token.upCake, 56],
  [Token.upCro, 25],
])

export const baseTickers = new Map([
  [Token.ROOT, "WETH"],
  [Token.upTether, "USDT"],
  [Token.upBNB, "wBNB"],
  [Token.upMatic, "wMATIC"],
  [Token.upCake, "CAKE"],
  [Token.upCro, "CRO"],
])

export const eliteTickers = new Map([
  [Token.ROOT, "KETH"],
  [Token.upTether, "eUSDT"],
  [Token.upBNB, "eBNB"],
  [Token.upMatic, "eMATIC"],
  [Token.upCake, "eCAKE"],
])

export const rootedTickers = new Map([
  [Token.ROOT, "ROOT"],
  [Token.upTether, "upUSDT"],
  [Token.upBNB, "upBNB"],
  [Token.upMatic, "upMATIC"],
  [Token.upCake, "upCAKE"],
  [Token.upCro, "upCRO"],
])

export const stakingTickers = new Map([
  [Token.upTether, "xUpUSDT"],
  [Token.upBNB, "xUpBNB"],  
  [Token.upMatic, "xUpMATIC"],
  [Token.upCake, "xUpCAKE"],
  [Token.upCro, "xUpCRO"],
])

export const baseAddresses = new Map([
  [Token.ROOT, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
  [Token.upTether, "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"],
  [Token.upBNB, "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"],
  [Token.upMatic, "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"],
  [Token.upCake, "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"],
  [Token.upCro, "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23"]
])

export const eliteAddresses = new Map([
  [Token.ROOT, "0x93747501F46Ae40b8A4B8F1a1529696AE24ea04e"],
  [Token.upTether, "0xbFDF833E65Bd8B27c84fbE55DD17F7648C532168"],
  [Token.upBNB, "0xb7db0850096aeaec1b615463202db441012c564f"],
  [Token.upMatic, "0x63ed7f9D97d6658E46dDA23e50DdF82D86070580"],
  [Token.upCake, "0x5C8E4C13c7db38C331eb85C114eb08d1BCd2f3c6"],
  [Token.upCro, "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23"]
])

export const rootedAddresses = new Map([
  [Token.ROOT, "0xcb5f72d37685c3d5ad0bb5f982443bc8fcdf570e"],
  [Token.upTether, "0xCb5f72d37685C3D5aD0bB5F982443BC8FcdF570E"],
  [Token.upBNB, "0x1759254EB142bcF0175347D5A0f3c19235538a9A"],
  [Token.upMatic, "0xe6a11F125a834E0676F3f8f33eb347D4e1938264"],
  [Token.upCake, "0x982f535c1dA184876d6e264920EdcA36B78e9f4C"],
  [Token.upCro, "0xb062084aFfDf75b9b494D56B8417F1B981Df790f"],
])

export const stakingAddresses = new Map([
  [Token.upTether, "0xc328f44ecaCE72cdeBc3e8E86E6705604BE2d2e1"],
  [Token.upBNB, "0x49Ba5c83F151F8f786CF2623243b66dC42492d41"],
  [Token.upMatic, "0x6995c181Aae9fEA21EF5a860297b92Df8A57f7A3"],
  [Token.upCake, "0x0f26b5b438938633e4268ba3b8f497e43add599c"],
  [Token.upCro, "0x78Bf858Ef5f5C286cb8CAaa145D7376d7a96d90e"],
])

export const usdAddresses = new Map([
  [Token.upCro, "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59"]
])

export const basePoolAddresses = new Map([
  [Token.ROOT, "0x01f8989c1e556f5c89c7d46786db98eeaae82c33"],
  [Token.upBNB, "0x27d078b13C2239606783679895Ec3b164da24D90"],
  [Token.upMatic, "0x928ed5a1259b1ce7b7c99ac5f100cf0db16b424e"],
  [Token.upCake, "0xB073ac3328B335612C6BB6861d69De475d517dA2"],
  [Token.upCro, "0xb0a7d88202eB8bf3c43D506b712b4E474eB9cdA3"]
])

export const elitePoolAddresses = new Map([
  [Token.ROOT, "0x44ee37ba8c98493f2590811c197ddd474c911d46"],
  [Token.upTether, "0x50db5be8c0c878e28fe231c647ef41b395463ffb"],
  [Token.upBNB, "0x0C51ec4743C1ae6be3c193926BA04458A56e4437"],
  [Token.upMatic, "0xF63E5bfDC51C0236Ef662f02738c482f91f37B24"],
  [Token.upCake, "0x9dC5207bb1CF76374443Fbc474fFf6bEC6D65223"],
])

export const vaultAddresses = new Map([
  [Token.ROOT, "0xc547D2bc0C3606602a4C9A530BFadDBc07A7f06F"],
  [Token.upTether, "0x3B2688B05B40C23bc5EA11b116733cD282450207"],
  [Token.upBNB, "0xe6Fc0Bef42a263dcC375a82Fa36Ee520Fce2F6c4"],
  [Token.upMatic, "0xd9E0b819B782CF7e1b554c750964dC4D8c92e1EB"],
  [Token.upCake, "0x816b55f5afa643fd60D5Ee17C5733b0f33197ff9"],
  [Token.upCro, "0x2774A22C1fE0d2561432C58ebE65a65664a25100"]
])

export const calculatorAddresses = new Map([
  [Token.ROOT, "0xA12C55637E642C0e79C5923125cd7eeb8be3a53F"],
  [Token.upTether, "0xdc436261C356E136b1671442d0bD0Ae183a6d77D"],
  [Token.upBNB, "0x2Cf93f951C44980Fb1790524d4f1a32A5dC7dadC"],
  [Token.upMatic, "0x387b14c7f3d72679314567a063735f63632b127f"],
  [Token.upCake, "0x5C7725822912FA938f7A0164E4Ae925cDbdC0510"],
  [Token.upCro, "0xc9aE79B03F1913d9CBe8FB973596dF64a3774Eed"]
])

export const transfetGateAddresses = new Map([
  [Token.ROOT, "0x105E66f0bfD5b3b1E386D0dC6EC00F3342EF3fF6"],
  [Token.upTether, "0x621642243CC6bE2D18b451e2386c52d1e9f7eDF6"],
  [Token.upBNB, "0xF0282B35AA35885AB99c42dbc3Cd76097Be308aB"],
  [Token.upMatic, "0xf40e1Ad286872f4a43E2FF5ca294e8F4b7772F36"],
  [Token.upCake, "0xe281f2e3447787B46e0eB0b87E3A172CC3B7eBcD"],
  [Token.upCro, "0xF6454A470E0303251644c47AD1dF82386a59C93D"]
])

export const feeSplitterAddresses = new Map([
  [Token.upTether, "0x89BF266B932a4419985E4c5FDf7b06555519f036"],
  [Token.upBNB, "0x6C6383dD4934a1157E0dCe5EE0B4a090b5D53ad2"],
  [Token.upMatic, "0x96E5b9e7bc0eC533385e18572b9155f9656ad735"],
  [Token.upCake, "0x6C6383dD4934a1157E0dCe5EE0B4a090b5D53ad2"],
  [Token.upCro, "0x85dC171504D0a4B52Be6Ec9f98B94A62Cef48951"]
])

export const arbitrageAddresses = new Map([
  [Token.ROOT, "0xcf53281777CeBcD2D2646E12Ca9e8fAeA0e1a3aF"],
  [Token.upBNB, "0xfB84e9F38Ac5dB78155c26196b5eCC75040282a9"],
  [Token.upMatic, "0x36d45358CeEC6D8fF80572d0210aaCA9c66E3F66"],
  [Token.upCake, "0x9D6DF694edc9a720dCc637Cd5644b4f1C274DF28"]
])

export const singleSideLiqudityAdderAddresses = new Map([
  [Token.ROOT, ""],
  [Token.upBNB, "0x33C8A1B3275c2B2D5bf7fe7C536F3B6B34677566"],
])

export const routerAddresses = new Map([
  [Token.ROOT, "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"],
  [Token.upTether, "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"],
  [Token.upBNB, "0x10ed43c718714eb63d5aa57b78b54704e256024e"],
  [Token.upMatic, "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"],
  [Token.upCake, "0x10ed43c718714eb63d5aa57b78b54704e256024e"],
  [Token.upCro, "0xdADaae6cDFE4FA3c35d54811087b3bC3Cd60F348"]
])

export const factoryAddresses = new Map([
  [Token.ROOT, "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"],
  [Token.upTether, "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"],
  [Token.upBNB, "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"],
  [Token.upMatic, "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"],
  [Token.upCake, "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"],
  [Token.upCro, "0x06530550A48F990360DFD642d2132354A144F31d"]
])

export const rootedRouterAddresses = new Map([
  [Token.upTether, "0x04A2fAB8dD40EEE62A12ce8692853e291ddbF54A"]
])

export const rootedTokenInBasePool = new Map([
  [Token.ROOT, 1],
  [Token.upTether, 1],
  [Token.upBNB, 0],
  [Token.upMatic, 1],
  [Token.upCake, 1],
  [Token.upCro, 1],
])

export const routerName = new Map([
  [Token.ROOT, "Uniswap"],
  [Token.upTether, "Quickswap"],
  [Token.upBNB, "Panecakeswap"],
  [Token.upMatic, "Quickswap"],
  [Token.upCake, "Panecakeswap"],
  [Token.upCro, "EmpireDex"],
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

  export const SUPPORTED_NETWORKS: {
    [chain in number]?: {
      chainId: string
      chainName: string
      nativeCurrency: {
        name: string
        symbol: string
        decimals: number
      }
      rpcUrls: string[]
      blockExplorerUrls: string[]
    }
  } = {
    [1]: {
      chainId: '0x1',
      chainName: 'Ethereum',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://mainnet.infura.io/v3'],
      blockExplorerUrls: ['https://etherscan.com'],
    },
    [56]: {
      chainId: '0x38',
      chainName: 'Binance Smart Chain',
      nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org'],
      blockExplorerUrls: ['https://bscscan.com'],
    },
    [137]: {
      chainId: '0x89',
      chainName: 'Polygon',
      nativeCurrency: {
        name: 'Polygon',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://polygon-rpc.com/'],
      blockExplorerUrls: ['https://polygonscan.com/'],
    },
    [25]: {
      chainId: '0x19',
      chainName: 'Cronos',
      nativeCurrency: {
        name: 'Cronos',
        symbol: 'CRO',
        decimals: 18,
      },
      rpcUrls: ['https://evm-cronos.crypto.org'],
      blockExplorerUrls: ['https://cronoscan.com/']
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

export const MaticToken = new TokenInfo("MATIC", baseAddresses.get(Token.upMatic)!);
export const EMaticToken = new TokenInfo("eMATIC", eliteAddresses.get(Token.upMatic)!);
export const UpMaticToken = new TokenInfo("upMATIC", rootedAddresses.get(Token.upMatic)!);
export const MaticLpToken = new TokenInfo("MATIC LP", basePoolAddresses.get(Token.upMatic)!);
export const EMaticLpToken = new TokenInfo("eMATIC LP", elitePoolAddresses.get(Token.upMatic)!);

export const CakeToken = new TokenInfo("CAKE", baseAddresses.get(Token.upCake)!);
export const ECakeToken = new TokenInfo("eCAKE", eliteAddresses.get(Token.upCake)!);
export const UpCakeToken = new TokenInfo("upCAKE", rootedAddresses.get(Token.upCake)!);
export const CakeLpToken = new TokenInfo("CAKE LP", basePoolAddresses.get(Token.upCake)!);
export const ECakeLpToken = new TokenInfo("eCAKE LP", elitePoolAddresses.get(Token.upCake)!);

export const CroToken = new TokenInfo("CRO", baseAddresses.get(Token.upCro)!);
export const UpCroToken = new TokenInfo("upCRO", rootedAddresses.get(Token.upCro)!);
export const CroLpToken = new TokenInfo("CRO LP", basePoolAddresses.get(Token.upCro)!);
export const CroUSDCToken = new TokenInfo("USDC", usdAddresses.get(Token.upCro)!, 6);

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

  if (address === MaticToken.address) return MaticToken
  if (address === EMaticToken.address) return EMaticToken
  if (address === UpMaticToken.address) return UpMaticToken
  if (address === MaticLpToken.address) return MaticLpToken
  if (address === EMaticLpToken.address) return EMaticLpToken

  if (address === CakeToken.address) return CakeToken
  if (address === ECakeToken.address) return ECakeToken
  if (address === UpCakeToken.address) return UpCakeToken
  if (address === CakeLpToken.address) return CakeLpToken
  if (address === ECakeLpToken.address) return ECakeLpToken

  if (address === CroToken.address) return CroToken
  if (address === UpCroToken.address) return UpCroToken
  if (address === CroLpToken.address) return CroLpToken
  if (address === CroUSDCToken.address) return CroUSDCToken

  return undefined
}