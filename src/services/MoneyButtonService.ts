import { Contract } from '@ethersproject/contracts'
import moneyButtonAbi from '../constants/abis/moneyButton.json'
import { Web3Provider } from '@ethersproject/providers'
import { MONEY_BUTTON_ADDRESS, KETH_ADDRESS, WETH_ADDRESS, ROOT_ADDRESS } from '../constants';
import { parseEther } from '@ethersproject/units'
import { getDisplayBalance } from '../utils/formatBalance';
import BigNumber from 'bignumber.js';
import { calculateGas } from '../utils';

export class MoneyButtonService {
    private contract: Contract

    constructor(library: Web3Provider, account: string){
        const signer = library.getSigner(account).connectUnchecked()
        this.contract = new Contract(MONEY_BUTTON_ADDRESS, moneyButtonAbi, signer)        
    }

    private getPath(rootFirst: boolean)
    {
        const path: string[] = []
        path.push(WETH_ADDRESS)
        path.push(rootFirst ? ROOT_ADDRESS : KETH_ADDRESS)
        path.push(rootFirst ? KETH_ADDRESS : ROOT_ADDRESS)
        path.push(WETH_ADDRESS)
        return path
    }

    public async estimateProfit(rootFirst: boolean, amountIn: string)
    {
        const path = this.getPath(rootFirst)
        const profit = await this.contract.estimateProfit(path, parseEther(amountIn))
        return getDisplayBalance(new BigNumber(profit.toString()))
    }

    public async gimmeMoney(rootFirst: boolean, amountIn: string)
    {
        const minProfit = "0.01"
        const path = this.getPath(rootFirst)
        const gas = await this.contract.estimateGas.gimmeMoney(path, parseEther(amountIn), parseEther(minProfit))
        return await this.contract.gimmeMoney(path, parseEther(amountIn), parseEther(minProfit), { gasLimit: calculateGas(gas.toNumber()) })
    }
}