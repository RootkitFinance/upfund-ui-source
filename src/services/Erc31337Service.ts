import { Contract } from '@ethersproject/contracts'
import erc31337Abi from '../constants/abis/erc31337.json'
import upCroAbi from '../constants/abis/upCro.json'
import { Web3Provider } from '@ethersproject/providers'
import { rootedAddresses, Token } from '../constants'
import { parseEther } from '@ethersproject/units'

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

    public async sweepUpCroFloor(value: string)
    {
        const contract = new Contract(rootedAddresses.get(Token.upCro)!, upCroAbi, this.signer)
        return await contract.sweep(parseEther(value), [])   
    }

    public async setSweeper(tokenAddress: string, sweeper: string, allow: boolean)
    {
        const contract = new Contract(tokenAddress, erc31337Abi, this.signer)
        return await contract.setSweeper(sweeper, allow)   
    }
}