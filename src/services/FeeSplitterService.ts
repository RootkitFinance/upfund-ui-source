import { Contract } from '@ethersproject/contracts'
import feeSplitterAbi from '../constants/abis/feeSplitter.json'
import { Web3Provider } from '@ethersproject/providers'
import { feeSplitterAddresses, rootedAddresses, Token } from '../constants'
import { calculateGas } from '../utils'

export class FeeSplitterService {
    private contract: Contract
    private token: Token;

    constructor(token: Token, library: Web3Provider, account: string) {
        const signer = library.getSigner(account).connectUnchecked();
        this.token = token;
        this.contract = new Contract(feeSplitterAddresses.get(token)!, feeSplitterAbi, signer);            
    }

    public async payFees() {
        if (this.token !== Token.ROOT) {
            const rootedAddress = rootedAddresses.get(this.token)!;
            const gas = await this.contract.estimateGas.payFees(rootedAddress);
            return await this.contract.payFees(rootedAddress, { gasLimit: calculateGas(gas.toNumber()) });
        }        
    }

    public async setFees(burnRate: string, sellRate: string, keepRate: string) {
        if (this.token !== Token.ROOT) {
            const rootedAddress = rootedAddresses.get(this.token)!;
            const gas = await this.contract.estimateGas.setFees(rootedAddress, burnRate, sellRate, keepRate);
            return await this.contract.setFees(rootedAddress, burnRate, sellRate, keepRate, { gasLimit: calculateGas(gas.toNumber()) });
        }        
    }
}