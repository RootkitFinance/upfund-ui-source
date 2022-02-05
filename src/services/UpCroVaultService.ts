import { Contract } from '@ethersproject/contracts'
import vaultAbi from '../constants/abis/upCroVault.json'
import routerAbi from '../constants/abis/uniswapV2Router.json'
import erc20Abi from '../constants/abis/erc20.json'
import { Web3Provider } from '@ethersproject/providers'
import { baseAddresses, vaultAddresses, rootedAddresses, routerAddresses, Token, basePoolAddresses, usdAddresses } from '../constants';
import { parseEther, parseUnits } from '@ethersproject/units'
import { calculateGas } from '../utils';
import { BigNumber } from '@ethersproject/bignumber'

export class UpCroVaultService {
    contract: Contract
    routerContract: Contract
    vvsRouterContract: Contract
    signer: any
    base: string
    rooted: string
    usd: string
    pair: string

    constructor(library: Web3Provider, account: string) {
        const token = Token.upCro;
        this.signer = library.getSigner(account).connectUnchecked()
        this.contract = new Contract(vaultAddresses.get(token)!, vaultAbi, this.signer);      
        this.routerContract = new Contract(routerAddresses.get(token)!, routerAbi, this.signer);
        this.vvsRouterContract = new Contract("0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae", routerAbi, this.signer);
        this.base = baseAddresses.get(token)!
        this.rooted = rootedAddresses.get(token)!
        this.usd = usdAddresses.get(token)!
        this.pair = basePoolAddresses.get(token)!
    }

    public async buyAndTax(amountToSpend: string, taxRate: string, duration: string) {      
        const amount = parseEther(amountToSpend).toString();
        const minAmountOut = await this.calculateMinAmountOut([this.base, this.rooted], amount.toString());
        const gas = await this.contract.estimateGas.buyAndTax(amount, minAmountOut, taxRate, duration);
        return await this.contract.buyAndTax(amount, minAmountOut, taxRate, duration, { gasLimit: calculateGas(gas.toNumber()) })
    }    

    public async sweepFloor(amountToSweep: string) {
        const amount = parseEther(amountToSweep);
        const gas = await this.contract.estimateGas.sweepFloor(amount)
        return await this.contract.sweepFloor(amount, { gasLimit: calculateGas(gas.toNumber()) })
    }
    
    public async unsweepFloor(amountToUnsweep: string) {
        const amount = parseEther(amountToUnsweep);
        const gas = await this.contract.estimateGas.unsweepFloor(amount)
        return await this.contract.unsweepFloor(amount, { gasLimit: calculateGas(gas.toNumber()) })
    }

    public async reduceLockedLiquidity() {
        const upCroContract = new Contract(this.rooted, erc20Abi, this.signer);    
        const pairBalance = await upCroContract.balanceOf(this.pair);
        const amountToRemove = pairBalance.mul(BigNumber.from(23)).div(BigNumber.from(1000)).div(BigNumber.from(2)).mul(BigNumber.from(997)).div(BigNumber.from(1000))
        const minAmountOut = this.calculateMinAmountOut([this.rooted, this.base], amountToRemove.toString());
        const gas = await this.contract.estimateGas.reduceLockedLiquidity(minAmountOut)
        return await this.contract.reduceLockedLiquidity(minAmountOut, { gasLimit: calculateGas(gas.toNumber()) })
    }

    public async empireSwap(tokenIn: string, tokenOut: string, amountIn: string){
        const amount = parseEther(amountIn);
        const minAmountOut = await this.calculateMinAmountOut([tokenIn, tokenOut], amount.toString());
        const gas = await this.contract.estimateGas.empireSwap(tokenIn, tokenOut, amount, minAmountOut);
        return await this.contract.empireSwap(tokenIn, tokenOut, amount, minAmountOut, { gasLimit: calculateGas(gas.toNumber()) });
    }

    public async altRouterSwap(tokenIn: string, tokenOut: string, amountIn: string){
        const amount = tokenIn === this.usd ? parseUnits(amountIn, 6) : parseEther(amountIn);
        const minAmountOut = await this.vvsRouterCalculateMinAmountOut([tokenIn, tokenOut], amount.toString());
        const gas = await this.contract.estimateGas.altRouterSwap(tokenIn, tokenOut, amount, minAmountOut);
        return await this.contract.altRouterSwap(tokenIn, tokenOut, amount, minAmountOut, { gasLimit: calculateGas(gas.toNumber()) });        
    }

    public async croUsdSwap(amountIn: string) {
        const amount = parseEther(amountIn);
        const minAmountOut = await this.vvsRouterCalculateMinAmountOut([this.base, this.usd], amount.toString());
        const gas = await this.contract.estimateGas.CroUsdSwap(amount, minAmountOut);
        return await this.contract.CroUsdSwap(amount, minAmountOut, { gasLimit: calculateGas(gas.toNumber()) });
    }

    public async usdCroSwap(amountIn: string) {
        const amount = parseUnits(amountIn, 6);
        const minAmountOut = this.vvsRouterCalculateMinAmountOut([this.usd, this.base], amount.toString());
        const gas = await this.contract.estimateGas.UsdCroSwap(amount, minAmountOut);
        return await this.contract.UsdCroSwap(amount, minAmountOut, { gasLimit: calculateGas(gas.toNumber()) });
    }

    public async addLiquidity(baseAmountToAdd: string, rootedAmountToAdd: string) {
        const baseAmount = parseEther(baseAmountToAdd);
        const rootedAmount = parseEther(rootedAmountToAdd);
        const gas = await this.contract.estimateGas.addLiquidity(this.rooted, rootedAmount, this.base, baseAmount);       
        return await this.contract.addLiquidity(this.rooted, rootedAmount, this.base, baseAmount, { gasLimit: calculateGas(gas.toNumber()) })    
    }

    public async removeLiquidity(amountToRemove: string) {
        const gas = await this.contract.estimateGas.removeLiquidity(this.pair, parseEther(amountToRemove))
        return await this.contract.removeLiquidity(this.pair, parseEther(amountToRemove), { gasLimit: calculateGas(gas.toNumber()) })   
    }

    public async buyRooted(amountToSpend: string) {
        const amount = parseEther(amountToSpend);
        const minAmountOut = await this.calculateMinAmountOut([this.base, this.rooted], amount.toString());
        const gas = await this.contract.estimateGas.buyRooted(minAmountOut, amount)
        return await this.contract.buyRooted(minAmountOut, amount, { gasLimit: calculateGas(gas.toNumber()) })    
    }

    public async sellRooted(amountToSpend: string) {
        const amount = parseEther(amountToSpend);
        const minAmountOut = await this.calculateMinAmountOut([this.rooted, this.base], amount.toString());
        const gas = await this.contract.estimateGas.sellRooted(minAmountOut, amount)
        return await this.contract.sellRooted(minAmountOut, amount, { gasLimit: calculateGas(gas.toNumber()) })    
    }    

    public async recoverTokens(tokenAddress: string) {
        return await this.contract.recoverTokens(tokenAddress)
    }

    async calculateMinAmountOut(path: string[], amountIn: any){       
        const amountsOut = await this.routerContract.getAmountsOut(amountIn, path);
        const amountOut = amountsOut[path.length - 1]; 
        return amountOut.mul(BigNumber.from(99)).div(BigNumber.from(100));
    }

    async vvsRouterCalculateMinAmountOut(path: string[], amountIn: any){
        const amountsOut = await this.vvsRouterContract.getAmountsOut(amountIn, path);
        const amountOut = amountsOut[path.length - 1]; 
        return amountOut.mul(BigNumber.from(99)).div(BigNumber.from(100));
    }
}  