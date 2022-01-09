import { Contract } from '@ethersproject/contracts'
import upBNBVaultAbi from '../constants/abis/upBnbVault.json'
import rootVaultAbi from '../constants/abis/rootVault.json'
import upTeatherVaultAbi from '../constants/abis/upTeatherVault.json'
import erc20Abi from '../constants/abis/erc20.json'
import routerAbi from '../constants/abis/uniswapV2Router.json'
import { Web3Provider } from '@ethersproject/providers'
import { baseAddresses, baseDecimals, basePoolAddresses, elitePoolAddresses, vaultAddresses, rootedAddresses, routerAddresses, Token, eliteAddresses } from '../constants';
import { parseEther, parseUnits } from '@ethersproject/units'
import { calculateGas } from '../utils';
import { BigNumber } from '@ethersproject/bignumber'

export class VaultService {
    contract: Contract
    routerContract: Contract
    token: Token
    signer: any
    base: string
    elite: string
    rooted: string

    constructor(token: Token, library: Web3Provider, account: string) {
        this.token = token;
        this.signer = library.getSigner(account).connectUnchecked()
        const abi = token === Token.ROOT ? rootVaultAbi : token === Token.upTether ? upTeatherVaultAbi : upBNBVaultAbi;
        this.contract = new Contract(vaultAddresses.get(token)!, abi, this.signer);      
        this.routerContract = new Contract(routerAddresses.get(token)!, routerAbi, this.signer);
        this.base = baseAddresses.get(token)!
        this.elite = eliteAddresses.get(token)!
        this.rooted = rootedAddresses.get(token)!
    }    

    public async setSeniorVaultManager(manager: string, allow: boolean) {      
        return await this.contract.setSeniorVaultManager(manager, allow);   
    }

    public async setCalculatorAndGate(calculator: string, gate: string){
        return await this.contract.setCalculatorAndGate(calculator, gate);     
    }   

    public async balancePriceBase(baseAmount: string) {
        const amount = parseEther(baseAmount);
        const minAmountOut = await this.calculateMinAmountOut([this.base, this.rooted, this.elite], amount);
        const gas = await this.contract.estimateGas.balancePriceBase(amount, minAmountOut);        
        return await this.contract.balancePriceBase(amount, minAmountOut, { gasLimit: calculateGas(gas.toNumber()) })
    }

    public async balancePriceElite(eliteAmount: string) {
        const amount = parseEther(eliteAmount);
        const minAmountOut = await this.calculateMinAmountOut([this.elite, this.rooted, this.base], amount);
        const gas = await this.contract.estimateGas.balancePriceElite(amount, minAmountOut);
        return await this.contract.balancePriceElite(amount, minAmountOut, { gasLimit: calculateGas(gas.toNumber()) })
    }    

    public async removeBuyAndTax(lpAmount: string, tokenAddress: string, taxRate: string, duration: string) {
        const amount = parseEther(lpAmount);
        if (this.token === Token.upTether) {
            const minAmountOut = await this.calculateMinAmountOutAfterRemovingLiquidity(elitePoolAddresses.get(this.token)!, this.elite, amount);
            const gas = await this.contract.estimateGas.removeBuyAndTax(amount, minAmountOut, taxRate, duration);
            return await this.contract.removeBuyAndTax(amount, minAmountOut, taxRate, duration, { gasLimit: calculateGas(gas.toNumber()) }) //parse decimals!!!!
        }

        const pairAddress = baseAddresses.get(this.token)! === tokenAddress ? basePoolAddresses.get(this.token)! : elitePoolAddresses.get(this.token)!;
        const minAmountOut = await this.calculateMinAmountOutAfterRemovingLiquidity(pairAddress, tokenAddress, amount);
        const gas = await this.contract.estimateGas.removeBuyAndTax(amount, minAmountOut, tokenAddress, taxRate, duration)
        return await this.contract.removeBuyAndTax(amount, minAmountOut, tokenAddress, taxRate, duration, { gasLimit: calculateGas(gas.toNumber()) }) //parse decimals!!!        
    }

    public async buyAndTax(tokenAddress: string, amountToSpend: string, taxRate: string, duration: string) {      
        if (this.token === Token.upTether) {
            const amount = parseUnits(amountToSpend, baseDecimals.get(this.token)!).toString();
            const minAmountOut = await this.calculateMinAmountOut([this.elite, this.rooted], amount);
            const gas = await this.contract.estimateGas.buyAndTax(amount, minAmountOut, taxRate, duration)
            return await this.contract.buyAndTax(amount, minAmountOut, taxRate, duration, { gasLimit: calculateGas(gas.toNumber()) })
        }  
       
        const amount = parseEther(amountToSpend).toString();
        const minAmountOut = await this.calculateMinAmountOut([tokenAddress, this.rooted], amount.toString());
        const gas = await this.contract.estimateGas.buyAndTax(tokenAddress, amount, minAmountOut, taxRate, duration);
        return await this.contract.buyAndTax(tokenAddress, amount, minAmountOut, taxRate, duration, { gasLimit: calculateGas(gas.toNumber()) })
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
            const minAmountOut = await this.calculateMinAmountOut([this.elite, this.rooted], amount.toString());
            const gas = await this.contract.estimateGas.buyRooted(amount, minAmountOut);
            return await this.contract.buyRooted(amount, minAmountOut, { gasLimit: calculateGas(gas.toNumber()) })
        }
        const amount = parseEther(amountToSpend);
        const minAmountOut = await this.calculateMinAmountOut([tokenAddress, this.rooted], amount.toString());
        const gas = await this.contract.estimateGas.buyRooted(tokenAddress, amount, minAmountOut)
        return await this.contract.buyRooted(tokenAddress, amount, minAmountOut, { gasLimit: calculateGas(gas.toNumber()) })    
    }

    public async sellRooted(tokenAddress: string, amountToSpend: string) {
        const amount = parseEther(amountToSpend);

        if (this.token === Token.upTether) {
            const minAmountOut = await this.calculateMinAmountOut([this.rooted, this.elite], amount.toString());
            const gas = await this.contract.estimateGas.sellRooted(amount, minAmountOut);
            return await this.contract.sellRooted(amount, minAmountOut, { gasLimit: calculateGas(gas.toNumber()) })
        }
        const minAmountOut = await this.calculateMinAmountOut([this.rooted, tokenAddress], amount.toString());
        const gas = await this.contract.estimateGas.sellRooted(tokenAddress, amount, minAmountOut)
        return await this.contract.sellRooted(tokenAddress, amount, minAmountOut, { gasLimit: calculateGas(gas.toNumber()) })    
    }    

    public async recoverTokens(tokenAddress: string) {
        return await this.contract.recoverTokens(tokenAddress)
    }

    async calculateMinAmountOutAfterRemovingLiquidity(pairAddress: string, tokenAddress: string, lpAmount: any){
        const pairContract = new Contract(pairAddress, erc20Abi, this.signer); 
        const tokenContract = new Contract(tokenAddress, erc20Abi, this.signer);
        const tokenBalance = await tokenContract.balanceOf(pairAddress);
        const totalSupply = await pairContract.totalSupply();
        const amountAfterRemovingLiquidity = lpAmount.mul(tokenBalance).div(totalSupply);
        const amountsOut = await this.routerContract.getAmountsOut(amountAfterRemovingLiquidity.toString(), [tokenAddress, this.rooted]);
        const amountOut = amountsOut[1].sub(amountsOut[1].mul(lpAmount).div(totalSupply));
        return amountOut.mul(BigNumber.from(99)).div(BigNumber.from(100));
    }

    async calculateMinAmountOut(path: string[], amountIn: any){       
        const amountsOut = await this.routerContract.getAmountsOut(amountIn, path);
        const amountOut = amountsOut[path.length - 1]; 
        return amountOut.mul(BigNumber.from(99)).div(BigNumber.from(100));
    }
}  