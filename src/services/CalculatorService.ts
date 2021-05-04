import { Contract } from '@ethersproject/contracts'
import calculatorAbi from '../constants/abis/calculator.json'
import { Web3Provider } from '@ethersproject/providers'
import { baseAddresses, calculatorAddresses, getTokenByAddress, Token } from '../constants';
import { getDisplayBalance } from '../utils/formatBalance';
import BigNumber from 'bignumber.js';

export class CalculatorService {
    private contract: Contract
    private baseAddress: string
    private eliteAddress: string  

    constructor(library: Web3Provider, account: string, token: Token) {
        const signer = library.getSigner(account).connectUnchecked()
        
        this.contract = new Contract(calculatorAddresses.get(token)!, calculatorAbi, signer)
        this.baseAddress = baseAddresses.get(token)!;
        this.eliteAddress = baseAddresses.get(token)!;               
    }

    public async calculatorSubFloor()
    {
        const baseToken = getTokenByAddress(this.baseAddress);
        try {
            const subFloor = await this.contract.calculateSubFloor(this.baseAddress, this.eliteAddress)            
            return getDisplayBalance(new BigNumber(subFloor.toString()), baseToken?.decimals)
        }
        catch(e) {
            return"ERROR"
        }
    }
}