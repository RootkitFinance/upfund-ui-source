import { Contract } from '@ethersproject/contracts'
import transferGateAbi from '../constants/abis/transferGate.json'
import { Web3Provider } from '@ethersproject/providers'
import { TRANSFER_GATE_ADDRESS } from '../constants';
import { parseEther } from '@ethersproject/units'

export class TransferGateService {
    private contract: Contract

    constructor(library: Web3Provider, account: string){
        const signer = library.getSigner(account).connectUnchecked()
        this.contract = new Contract(TRANSFER_GATE_ADDRESS, transferGateAbi, signer)
    }

    public async allowPool(token: string)
    {
        return await this.contract.allowPool(token)
    }

    public async safeAddLiquidity(
        token: string, 
        tokenAmount: string, 
        rootKitAmount: string, 
        minTokenAmount: string,
        minRootKitAmount: string,
        to: string,
        deadline: string)
    {
        return await this.contract.safeAddLiquidity(
            token, 
            parseEther(tokenAmount), 
            parseEther(rootKitAmount), 
            parseEther(minTokenAmount),
            parseEther(minRootKitAmount),
            to,
            deadline ? parseInt(deadline) : 0)
    }

    public async setUnrestrictedController(unrestrictedController: string, allow: boolean)
    {
        return await this.contract.setUnrestrictedController(unrestrictedController, allow)
    }

    public async setFeeController(feeController: string, allow: boolean)
    {
        return await this.contract.setFeeControllers(feeController, allow)
    }

    public async setFreeParticipant(participant: string, free: boolean)
    {
        return await this.contract.setFreeParticipant(participant, free)
    }

    public async setSellStakeRateMultiplier(multiplier: string)
    {
        return await this.contract.setSellStakeRateMultiplier(multiplier)
    }

    public async setDumpTax(startTaxRate: string, durationInSeconds: string)
    {
        return await this.contract.setDumpTax(startTaxRate, durationInSeconds)
    }
}