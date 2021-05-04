import { Contract } from '@ethersproject/contracts'
import erc31337Abi from '../constants/abis/erc31337.json'
import { Web3Provider } from '@ethersproject/providers'

export class Erc31337Service {
    private signer: any

    constructor(library: Web3Provider, account: string){
        this.signer = library.getSigner(account).connectUnchecked()       
    }

    public async sweepFloor(tokenAddress: string, toAddress: string)
    {
        const contract = new Contract(tokenAddress, erc31337Abi, this.signer)
        return await contract.sweepFloor(toAddress)   
    }

    public async setSweeper(tokenAddress: string, sweeper: string, allow: boolean)
    {
        const contract = new Contract(tokenAddress, erc31337Abi, this.signer)
        return await contract.setSweeper(sweeper, allow)   
    }
}