import { Contract } from '@ethersproject/contracts'
import upBNBVaultAbi from '../constants/abis/upBnbVault.json'
import rootVaultAbi from '../constants/abis/rootVault.json'
import upTeatherVaultAbi from '../constants/abis/upTeatherVault.json'
import { Web3Provider } from '@ethersproject/providers'
import { baseDecimals, liquidityControllerAddresses, Token } from '../constants';
import { parseEther, parseUnits } from '@ethersproject/units'
import { calculateGas } from '../utils';

export class LiquidityControllerService {
    contract: Contract
    token: Token

    constructor(token: Token, library: Web3Provider, account: string) {
        this.token = token;
        const signer = library.getSigner(account).connectUnchecked()
        const abi = token === Token.ROOT ? rootVaultAbi : token === Token.upBNB ? upBNBVaultAbi : upTeatherVaultAbi;
        this.contract = new Contract(liquidityControllerAddresses.get(token)!, abi, signer);        
    } 

    public async setLiquidityController(controller: string, infinite: boolean) {      
        if (this.token === Token.upTether) {
            return await this.contract.setSeniorVaultManager(controller, infinite);
        }
        return await this.contract.setLiquidityController(controller, infinite);        
    }

    public async setCalculatorAndGate(calculator: string, gate: string){
        return await this.contract.setCalculatorAndGate(calculator, gate);     
    }   

    public async balancePriceBase(amount: string){
        const gas = await this.contract.estimateGas.balancePriceBase(parseEther(amount))
        return await this.contract.balancePriceBase(parseEther(amount), { gasLimit: calculateGas(gas.toNumber()) })
    }

    public async balancePriceElite(amount: string){
        const gas = await this.contract.estimateGas.balancePriceElite(parseEther(amount))
        return await this.contract.balancePriceElite(parseEther(amount), { gasLimit: calculateGas(gas.toNumber()) })
    }

    public async removeBuyAndTax(lpAmount: string, tokenAddress: string, taxRate: string, duration: string) { 
        if (this.token === Token.upTether) {            
            const gas = await this.contract.estimateGas.removeBuyAndTax(parseEther(lpAmount).toString(), taxRate, duration)
            return await this.contract.removeBuyAndTax(parseEther(lpAmount).toString(), taxRate, duration, { gasLimit: calculateGas(gas.toNumber()) }) //parse decimals!!!!
        } 
        
        const gas = await this.contract.estimateGas.removeBuyAndTax(parseEther(lpAmount).toString(), tokenAddress, taxRate, duration)
        return await this.contract.removeBuyAndTax(parseEther(lpAmount).toString(), tokenAddress, taxRate, duration, { gasLimit: calculateGas(gas.toNumber()) }) //parse decimals!!!        
    }

    public async buyAndTax(tokenAddress: string, amountToSpend: string, taxRate: string, duration: string) {      
        if (this.token === Token.upTether) {
            const amount = parseUnits(amountToSpend, baseDecimals.get(this.token)!);
            const gas = await this.contract.estimateGas.buyAndTax(amount, taxRate, duration)
            return await this.contract.buyAndTax(amount, taxRate, duration, { gasLimit: calculateGas(gas.toNumber()) })
        }  
        const gas = await this.contract.estimateGas.buyAndTax(tokenAddress, parseEther(amountToSpend).toString(), taxRate, duration)
        return await this.contract.buyAndTax(tokenAddress, parseEther(amountToSpend).toString(), taxRate, duration, { gasLimit: calculateGas(gas.toNumber()) })
    }    

    public async sweepFloor() {
        const gas = await this.contract.estimateGas.sweepFloor()
        return await this.contract.sweepFloor({ gasLimit: calculateGas(gas.toNumber()) })
    }   

    public async zapEliteToBase(lpTokenAmount: string) {
        const gas = await this.contract.estimateGas.zapEliteToBase(parseEther(lpTokenAmount))
        return await this.contract.zapEliteToBase(parseEther(lpTokenAmount), { gasLimit: calculateGas(gas.toNumber()) })
    }

    public async zapBaseToElite(lpTokenAmount: string) {
        const gas = await this.contract.estimateGas.zapBaseToElite(parseEther(lpTokenAmount))
        return await this.contract.zapBaseToElite(parseEther(lpTokenAmount), { gasLimit: calculateGas(gas.toNumber()) })
    }

    public async wrapToElite(baseAmount: string) {
        const amount = parseUnits(baseAmount, baseDecimals.get(this.token)!);
        const gas = await this.contract.estimateGas.wrapToElite(amount)
        return await this.contract.wrapToElite(amount, { gasLimit: calculateGas(gas.toNumber()) })
    }

    public async unwrapElite(eliteAmount: string) {
        const amount = parseUnits(eliteAmount, baseDecimals.get(this.token)!);
        const gas = await this.contract.estimateGas.unwrapElite(amount)
        return await this.contract.unwrapElite(amount, { gasLimit: calculateGas(gas.toNumber()) })
    }

    public async addLiquidity(tokenAddress: string, amountToAdd: string) {
        if (this.token === Token.upTether) {
            const amount = parseUnits(amountToAdd, baseDecimals.get(this.token)!);
            const gas = await this.contract.estimateGas.addLiquidity(amount);
            return await this.contract.addLiquidity(amount, { gasLimit: calculateGas(gas.toNumber()) })
        }
        const gas = await this.contract.estimateGas.addLiquidity(tokenAddress, parseEther(amountToAdd))
        return await this.contract.addLiquidity(tokenAddress, parseEther(amountToAdd), { gasLimit: calculateGas(gas.toNumber()) })    
    }

    public async removeLiquidity(tokenAddress: string, amountToRemove: string) {
        if (this.token === Token.upTether) {
            const gas = await this.contract.estimateGas.removeLiquidity(parseEther(amountToRemove))
            return await this.contract.removeLiquidity(parseEther(amountToRemove), { gasLimit: calculateGas(gas.toNumber()) })
        }
        const gas = await this.contract.estimateGas.removeLiquidity(tokenAddress, parseEther(amountToRemove))
        return await this.contract.removeLiquidity(tokenAddress, parseEther(amountToRemove), { gasLimit: calculateGas(gas.toNumber()) })   
    }

    public async buyRooted(tokenAddress: string, amountToSpend: string) {
        if (this.token === Token.upTether) {
            const amount = parseUnits(amountToSpend, baseDecimals.get(this.token)!);
            const gas = await this.contract.estimateGas.buyRooted(amount);
            return await this.contract.buyRooted(amount, { gasLimit: calculateGas(gas.toNumber()) })
        }
        const gas = await this.contract.estimateGas.buyRooted(tokenAddress, parseEther(amountToSpend))
        return await this.contract.buyRooted(tokenAddress, parseEther(amountToSpend), { gasLimit: calculateGas(gas.toNumber()) })    
    }

    public async sellRooted(tokenAddress: string, amountToSpend: string) {
        if (this.token === Token.upTether) {
            const gas = await this.contract.estimateGas.sellRooted(parseEther(amountToSpend))
            return await this.contract.sellRooted(parseEther(amountToSpend), { gasLimit: calculateGas(gas.toNumber()) })
        }
        const gas = await this.contract.estimateGas.sellRooted(tokenAddress, parseEther(amountToSpend))
        return await this.contract.sellRooted(tokenAddress, parseEther(amountToSpend), { gasLimit: calculateGas(gas.toNumber()) })    
    }    

    public async recoverTokens(tokenAddress: string) {
        return await this.contract.recoverTokens(tokenAddress)
    }
}  