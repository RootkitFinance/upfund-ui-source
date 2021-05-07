import { Contract } from '@ethersproject/contracts'
import rootkitTransferGateAbi from '../constants/abis/rootkitTransferGate.json'
import transferGateAbi from '../constants/abis/transferGate.json'
import { Web3Provider } from '@ethersproject/providers'
import { Token, transfetGateAddresses } from '../constants';
import { parseEther } from '@ethersproject/units'

export class TransferGateService {
    private contract: Contract

    constructor(token: Token, library: Web3Provider, account: string) {
        const signer = library.getSigner(account).connectUnchecked()
        this.contract = new Contract(transfetGateAddresses.get(token)!, token === Token.ROOT ? rootkitTransferGateAbi : transferGateAbi, signer)
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