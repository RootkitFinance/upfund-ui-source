import { Contract } from '@ethersproject/contracts'
import uniswapV2Pair from '../constants/abis/uniswapV2Pair.json'
import { Web3Provider } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { TradeHistoryInfo } from '../dtos/TradeHistoryInfo'
import { getDisplayBalance } from '../utils/formatBalance'

export class TradeHistoryService {
    contract: Contract
    library: Web3Provider

    constructor(library: Web3Provider, account: string) {
        this.library = library;
        const signer = library.getSigner(account).connectUnchecked()
        this.contract = new Contract("0x01f8989c1e556f5c89c7D46786dB98eEAAe82c33", uniswapV2Pair, signer)
    }

    public async onSwap(action: (trade: TradeHistoryInfo) => void){
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
        const transferEvents = await this.contract.queryFilter(eventFilter, blockNumber - 100);
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
        const amountIn = amount0In.isZero() ? amount1In : amount0In
        const amountOut = amount0Out.isZero() ? amount1Out : amount0Out
        let rootAmount
        let type

        if (amountIn.gt(amountOut)) {
            type = "buy"
            rootAmount = amountOut
        } 
        else {
            type = "sell"
            rootAmount = amountIn
        }
        //formatEther()
        return new TradeHistoryInfo(blockDate.toLocaleTimeString(), type, getDisplayBalance(rootAmount))
    }

}
