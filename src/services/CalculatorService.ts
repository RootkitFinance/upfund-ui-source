import { Contract } from '@ethersproject/contracts'
import calculatorAbi from '../constants/abis/calculator.json'
import upCroCalculatorAbi from '../constants/abis/upCroCalculator.json'
import pairAbi from '../constants/abis/empirePair.json'
import { Web3Provider } from '@ethersproject/providers'
import { baseAddresses, basePoolAddresses, calculatorAddresses, eliteAddresses, getTokenByAddress, Token } from '../constants';
import { getDisplayBalance, getFullDisplayBalance } from '../utils/formatBalance';
import BigNumber from 'bignumber.js';

export class CalculatorService {
    private contract: Contract
    private baseAddress: string
    private token: Token
    private signer: any

    constructor(library: Web3Provider, account: string, token: Token) {
        const signer = library.getSigner(account).connectUnchecked()
        this.contract = new Contract(calculatorAddresses.get(token)!, token === Token.upCro ? upCroCalculatorAbi : calculatorAbi, signer)
        this.baseAddress = baseAddresses.get(token)!;
        this.token = token;
        this.signer = signer;
    }

    public async calculateSubFloor()
    {
        const baseToken = getTokenByAddress(this.baseAddress);
        try {
            if (this.token === Token.upCro) {
                const subFloor = await this.contract.calculateSubFloor();
                return getDisplayBalance(new BigNumber(subFloor[0].toString()), baseToken?.decimals)
            }
            else {
                const subFloor = await this.contract.calculateSubFloor(this.baseAddress, eliteAddresses.get(this.token)!)
                return getDisplayBalance(new BigNumber(subFloor.toString()), baseToken?.decimals)
            }
        }
        catch(e) {
            return"ERROR"
        }
    }

    public async getSweptAmount() {
        const pairContract = new Contract(basePoolAddresses.get(Token.upCro)!, pairAbi, this.signer);
        const amount = await pairContract.sweptAmount();
        return getFullDisplayBalance(new BigNumber(amount.toString()));
    }

}