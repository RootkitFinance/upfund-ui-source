import { Contract } from '@ethersproject/contracts'
import { parseEther } from '@ethersproject/units'
import erc20Abi from '../constants/abis/erc20.json'
import arbitrageAbi from '../constants/abis/arbitrage.json'
import routerAbi from '../constants/abis/uniswapV2Router.json'
import { Web3Provider } from '@ethersproject/providers'
import { baseAddresses, eliteAddresses, rootedAddresses, arbitrageAddresses, routerAddresses, Token, basePoolAddresses, elitePoolAddresses, baseTickers } from '../constants';
import { toNumber } from '../utils/formatBalance';
import { ArbitrageResultInfo, ResultType } from '../dtos/ArbitrageResultInfo';
import { extractErrorMessage } from '../utils/extractErrorMessage'

export class ArbitrageService {    
    private arbitrageContract: Contract
    private routerContract: Contract
    private baseContract: Contract
    private eliteContract: Contract
    private rootedContract: Contract    
    private basePoolAddress: string
    private elitePoolAddress: string
    private baseTicker: string

    constructor(library: Web3Provider, account: string, token: Token) {
        const signer = library.getSigner(account).connectUnchecked()
        this.arbitrageContract = new Contract(arbitrageAddresses.get(token)!, arbitrageAbi, signer);
        this.routerContract = new Contract(routerAddresses.get(token)!, routerAbi, signer);
        this.baseContract = new Contract(baseAddresses.get(token)!, erc20Abi, signer);
        this.eliteContract = new Contract(eliteAddresses.get(token)!, erc20Abi, signer);
        this.rootedContract = new Contract(rootedAddresses.get(token)!, erc20Abi, signer);
        this.basePoolAddress = basePoolAddresses.get(token)!;
        this.elitePoolAddress = elitePoolAddresses.get(token)!;
        this.baseTicker = baseTickers.get(token)!;
    }

    public async performArbitrage() {
        const baseBalanceInBasePool = toNumber(await this.baseContract.balanceOf(this.basePoolAddress));
        const rootedBalanceInBasePool = toNumber(await this.rootedContract.balanceOf(this.basePoolAddress));
        const priceInBasePool = baseBalanceInBasePool / rootedBalanceInBasePool;

        const eliteBalanceInElitePool = toNumber(await this.eliteContract.balanceOf(this.elitePoolAddress));
        const rootedBalanceInElitePool = toNumber(await this.rootedContract.balanceOf(this.elitePoolAddress));
        const priceInElitePool = eliteBalanceInElitePool / rootedBalanceInElitePool;

        const priceInBasePoolSmaller = priceInBasePool < priceInElitePool;
        const priceRatio = priceInBasePoolSmaller ? priceInBasePool / priceInElitePool : priceInElitePool / priceInBasePool;

        if (priceRatio >= 0.95) {
            return new ArbitrageResultInfo("", ResultType.None);
        }

        let a1, b1, a2, b2;

        if (priceInBasePoolSmaller) {
            a1 = baseBalanceInBasePool;
            b1 = rootedBalanceInBasePool;
            a2 = eliteBalanceInElitePool;
            b2 = rootedBalanceInElitePool;
        }
        else {
            a1 = eliteBalanceInElitePool;
            b1 = rootedBalanceInElitePool;
            a2 = baseBalanceInBasePool;
            b2 = rootedBalanceInBasePool;
        }

        const a = a1 * b1 - a2 * b2;
        const b = 2 * b1 * b2 * (a1 + a2);
        const c = b1 * b2 * (a1 * b2 - a2 * b1);
        const m = b ** 2 - 4 * a * c;

        if (m < 0) {
            return new ArbitrageResultInfo("Unable to calulcate arbitrage amount", ResultType.Error);
        }

        const sqrtM = Math.sqrt(m);
        const x1 = (-b + sqrtM) / (2 * a);
        const x2 = (-b - sqrtM) / (2 * a);

        const x1Valid = x1 > 0 && x1 < b1 && x1 < b2;
        const x2Valid = x2 > 0 && x2 < b1 && x2 < b2;

        if (!x1Valid && !x2Valid) {
            return new ArbitrageResultInfo("Unable to calulcate arbitrage amount", ResultType.Error);
        }

        const path = priceInBasePoolSmaller ? [this.baseContract.address, this.rootedContract.address] : [this.eliteContract.address, this.rootedContract.address];
        const amountOut = x1Valid ? x1 : x2;
        
        const amounts = await this.routerContract.getAmountsIn(parseEther(amountOut.toString()), path);
        const amountIn = amounts[0].toString();
        console.log(amountIn);

        try {
            const balanceBefore = await this.getBaseBalance();
            const txResponse = priceInBasePoolSmaller ?  await this.arbitrageContract.balancePriceBase(amountIn) : await this.arbitrageContract.balancePriceElite(amountIn);
            if (txResponse)
            {                 
                const receipt = await txResponse.wait();               
                if (receipt?.status === 1)
                {
                    const balanceAfter = await this.getBaseBalance();
                    return new ArbitrageResultInfo(`Arbitrage performed with ${(balanceAfter - balanceBefore).toFixed(2)} ${this.baseTicker} profit`, ResultType.Success);
                }
            }

            return new ArbitrageResultInfo("Arbitrage failed", ResultType.Error);   

        }
        catch (e) {
            console.log(e);
            const errorMessage = extractErrorMessage(e);
            return new ArbitrageResultInfo(`Arbitrage failed ${errorMessage}`, ResultType.Error);            
        }
    }

    private async getBaseBalance() {
        return toNumber(await this.baseContract.balanceOf(this.arbitrageContract.address));
    }
}