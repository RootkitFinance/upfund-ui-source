import { Contract } from '@ethersproject/contracts'
import vaultAbi from '../constants/abis/vault.json'
import { Web3Provider } from '@ethersproject/providers'
import { VAULT_ADDRESS } from '../constants';
import { parseEther } from '@ethersproject/units'

export class VaultService {
    private contract: Contract

    constructor(library: Web3Provider, account: string) {
        const signer = library.getSigner(account).connectUnchecked()
        this.contract = new Contract(VAULT_ADDRESS, vaultAbi, signer)        
    }

    public async sendToken(tokenAddress: string, recipient: string, amount: string) {
        return await this.contract.sendToken(tokenAddress, recipient, parseEther(amount))
    }
}