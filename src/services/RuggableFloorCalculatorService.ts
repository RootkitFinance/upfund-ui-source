import { Contract } from '@ethersproject/contracts'
import { parseEther } from '@ethersproject/units'
import ruggableFloorCalculatorAbi from '../constants/abis/ruggableFloorCalculator.json'
import { Web3Provider } from '@ethersproject/providers'
import { KETH_ADDRESS, RUGGABLE_FLOOR_CALCULATOR_ADDRESS, WETH_ADDRESS } from '../constants';
import { getDisplayBalance } from '../utils/formatBalance';
import BigNumber from 'bignumber.js';

export class RuggableFloorCalculatorService {
    private contract: Contract

    constructor(library: Web3Provider, account: string){
        const signer = library.getSigner(account).connectUnchecked()
        this.contract = new Contract(RUGGABLE_FLOOR_CALCULATOR_ADDRESS, ruggableFloorCalculatorAbi, signer)        
    }    

    public async calculateSubFloor()
    {
        const subFloor = await this.contract.calculateSubFloor(WETH_ADDRESS, KETH_ADDRESS);
        return getDisplayBalance(new BigNumber(subFloor.toString()))
    }

    public async setSubFloor(subFloor: string)
    {
        return await this.contract.setSubFloor(parseEther(subFloor));
    }
}