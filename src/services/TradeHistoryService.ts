import { Contract } from '@ethersproject/contracts'
import uniswapV2Pair from '../constants/abis/uniswapV2Pair.json'
import { Web3Provider } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { TradeHistoryInfo } from '../dtos/TradeHistoryInfo'
import { getDisplayBalance } from '../utils/formatBalance'
import { basePoolAddresses, elitePoolAddresses, rootedTokenInBasePool, Token } from '../constants'

export class TradeHistoryService {
    contract: Contract
    library: Web3Provider
    token: Token

    constructor(token: Token, library: Web3Provider, account: string) {
        this.token = token;
        this.library = library;
        const signer = library.getSigner(account).connectUnchecked()
        this.contract = new Contract(token === Token.upTether ? elitePoolAddresses.get(token)! : basePoolAddresses.get(token)!, uniswapV2Pair, signer)
    }

    public async onSwap(action: (trade: TradeHistoryInfo) => void) {
        this.contract.on("Swap", async (sender, amount0In, amount1In, amount0Out, amount1Out, to) => {
            const blockNumber = await this.library.getBlockNumber();
            this.toInfo(
                blockNumber, 
                new BigNumber(amount0In.toString()), 
                new BigNumber(amount1In.toString()),
                new BigNumber(amount0Out.toString()),
                new BigNumber(amount1Out.toString()),
                ).then(x => action(x))
        })
    }

    public async getTrades() {
       
        const blockNumber = await this.library.getBlockNumber();       
        const eventFilter = this.contract.filters.Swap()         
        const transferEvents = await this.contract.queryFilter(eventFilter, blockNumber - 500);
        const trades = []
        for(var i = transferEvents.length - 1; i >= 0; i--)
        {
            const event = transferEvents[i]
            trades.push(await this.toInfo(
                event.blockNumber, 
                new BigNumber(event.args?.amount0In.toString()), 
                new BigNumber(event.args?.amount1In.toString()),
                new BigNumber(event.args?.amount0Out.toString()),
                new BigNumber(event.args?.amount1Out.toString())))
        }       

       return trades
    }

    public async toInfo(blockNumber: number, amount0In: BigNumber, amount1In: BigNumber, amount0Out: BigNumber, amount1Out: BigNumber) {
        const block = await this.library.getBlock(blockNumber);
        const blockDate = new Date(block.timestamp*1000);
        
        const netToken0 = amount0In.minus(amount0Out)
        const netToken1 = amount1In.minus(amount1Out)

        let rootAmount = new BigNumber(0);
        let type = ""

        if (netToken0.isNegative()) {
            type = rootedTokenInBasePool.get(this.token)! === 0 ? "buy" : "sell";
            rootAmount = rootedTokenInBasePool.get(this.token)! === 0 ? netToken0.abs() : netToken1.abs()
        } else if (netToken1.isNegative()) {
            type = rootedTokenInBasePool.get(this.token)! === 0 ? "sell" : "buy";
            rootAmount = rootedTokenInBasePool.get(this.token)! === 0 ? netToken0.abs() : netToken1.abs()
        }
        return new TradeHistoryInfo(blockDate.toLocaleTimeString(), type, getDisplayBalance(rootAmount))
    }

}
