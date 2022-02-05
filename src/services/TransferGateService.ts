import { Contract } from '@ethersproject/contracts'
import rootkitTransferGateAbi from '../constants/abis/rootkitTransferGate.json'
import transferGateAbi from '../constants/abis/transferGate.json'
import { Web3Provider } from '@ethersproject/providers'
import { basePoolAddresses, elitePoolAddresses, Token, transfetGateAddresses } from '../constants';
import { parseEther } from '@ethersproject/units'

export class TransferGateService {
    private contract: Contract
    private token: Token;

    constructor(token: Token, library: Web3Provider, account: string) {
        const signer = library.getSigner(account).connectUnchecked();
        this.contract = new Contract(transfetGateAddresses.get(token)!, token === Token.ROOT ? rootkitTransferGateAbi : transferGateAbi, signer);
        this.token = token;
    }

    public async getBuyFees() {
        if (this.token === Token.ROOT){
            const params = await this.contract.parameters();
            const totalTax = parseFloat(params.stakeRate.toString()) + parseFloat(params.burnRate.toString()) + parseFloat(params.devRate.toString());
            return totalTax/100;
        }
        const rate = await this.contract.feesRate();
        return parseFloat((rate).toString())/100;
    }

    public async getSellFees() {
        const poolAddress = this.token === Token.upTether ? elitePoolAddresses.get(this.token)! : basePoolAddresses.get(this.token)!
        const dumpTax = parseFloat((await this.contract.getDumpTax()).toString())
        const poolTax = parseFloat((await this.contract.poolsTaxRates(poolAddress)).toString())
        let totalTax = poolTax + dumpTax;

        if (this.token !== Token.ROOT){
            const rate = parseFloat((await this.contract.feesRate()).toString());
            totalTax = poolTax > rate ? totalTax : rate;
            return totalTax/100;
        }
        
        const params = await this.contract.parameters();
        const burnRate = parseFloat(params.burnRate.toString());
        const devAndStateRate = parseFloat(params.stakeRate.toString()) + parseFloat(params.devRate.toString());
        totalTax = poolTax > burnRate ? totalTax + devAndStateRate : devAndStateRate + burnRate;
        return totalTax/100;        
    }

    public async allowPool(token: string) {
        return await this.contract.allowPool(token)
    }

    public async safeAddLiquidity (
        token: string, 
        tokenAmount: string, 
        rootKitAmount: string, 
        minTokenAmount: string,
        minRootKitAmount: string,
        to: string,
        deadline: string) {
        return await this.contract.safeAddLiquidity(
            token, 
            parseEther(tokenAmount), 
            parseEther(rootKitAmount), 
            parseEther(minTokenAmount),
            parseEther(minRootKitAmount),
            to,
            deadline ? parseInt(deadline) : 0);
    }

    public async setUnrestrictedController(unrestrictedController: string, allow: boolean) {
        return await this.contract.setUnrestrictedController(unrestrictedController, allow);
    }

    public async setFeeController(feeController: string, allow: boolean) {
        return await this.contract.setFeeControllers(feeController, allow);
    }

    public async setFreeParticipant(participant: string, free: boolean) {
        return await this.contract.setFreeParticipant(participant, free);
    }

    public async setDumpTax(startTaxRate: string, durationInSeconds: string) {
        return await this.contract.setDumpTax(startTaxRate, durationInSeconds);
    }

    public async setFees(feesRate: string) {
        return await this.contract.setFees(feesRate);
    }

    public async setPoolTaxRate(pool: string, taxRate: string) {
        return await this.contract.setPoolTaxRate(pool, taxRate);
    }
}