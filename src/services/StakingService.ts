import { Contract } from '@ethersproject/contracts'
import stakingAbi from '../constants/abis/staking.json'
import erc20Abi from '../constants/abis/erc20.json'
import { Web3Provider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import BigNumber from 'bignumber.js'

export class Staking
{
    user: string
    amount: BigNumber

    constructor (user: string, amount: string)
    {
        this.user = user.toLowerCase()
        this.amount = new BigNumber(amount)
    }
}

export class StakingService {
    contract: Contract
    defaultGasLimit: number
    lpContract: Contract

    constructor(library: Web3Provider, account: string){
        const signer = library.getSigner(account).connectUnchecked()
        this.contract = new Contract("0x39E9fB78b543748950827BF4c606F58724b67a80", stakingAbi, signer)  
        this.lpContract = new Contract("0x12a06769C5a8881aafb4eA0F6D8b7Ad79EaEBc35", erc20Abi, signer)   
        this.defaultGasLimit = 300000      
    }    

    public async getEvents() {
        let depositEvents = (await this.contract.queryFilter(this.contract.filters.Deposit())).map(x=>x.args).filter(x=>x?.poolId.toString() === "1").map(x=> new Staking(x!.user, x!.amount.toString()))
        console.log(depositEvents)
        const depositAddresses = new Set(depositEvents.map(x=>x.user))
        console.log(depositAddresses)

        let withdrawalEvents = (await this.contract.queryFilter(this.contract.filters.Withdraw())).map(x=>x.args).filter(x=>x?.poolId.toString() === "1").map(x=> new Staking(x!.user, x!.amount.toString()))
        console.log(withdrawalEvents)
        const withdrawalAddresses = new Set(withdrawalEvents.map(x=>x.user))
        console.log(withdrawalAddresses)

        let emergencyWithdrawEvents = (await this.contract.queryFilter(this.contract.filters.EmergencyWithdraw())).map(x=>x.args).filter(x=>x?.poolId.toString() === "1").map(x=> new Staking(x!.user, x!.amount.toString()))
        console.log(emergencyWithdrawEvents)
        const emergencyWithdrawAddresses = new Set(emergencyWithdrawEvents.map(x=>x.user))
        console.log(emergencyWithdrawAddresses)

        const stakers: Staking[] = []
        let totalBalance = new BigNumber(0)
        depositAddresses.forEach(a =>{
            let totalDeposit = new BigNumber(0)
            depositEvents.filter(x=>x.user === a).forEach(x=> {
                totalDeposit = totalDeposit.plus(x.amount)
            })

            let totalWithdrawal = new BigNumber(0)
            withdrawalEvents.filter(x=>x.user === a).forEach(x=> {
                totalWithdrawal = totalWithdrawal.plus(x.amount)
            })

            emergencyWithdrawEvents.filter(x=>x.user === a).forEach(x=> {
                totalWithdrawal = totalWithdrawal.plus(x.amount)
            })

            const balance = totalDeposit.minus(totalWithdrawal)
           
            if(balance.isNegative())
            {
                console.log("Negative")
            }

            if(balance.gt(new BigNumber(0)))
            {
                totalBalance = totalBalance.plus(balance)
                stakers.push(new Staking(a, balance.toString()))
            }

        })

        stakers.sort((a, b) => (a.amount.gt(b.amount)) ? -1 : 1)

        console.log(formatEther(totalBalance.toString()))
        
        const wethLpTotalSupply = await this.lpContract.totalSupply()
        const oneSeventh = wethLpTotalSupply.div(7)
        const oneSeventhNumber = parseFloat(formatEther(oneSeventh.toString()))
        console.log(formatEther(wethLpTotalSupply.toString()))
        console.log(oneSeventhNumber)

      
        stakers.forEach(x=>
            {
                const percent = parseFloat(x.amount.div(totalBalance).toString())
                const airDrop = oneSeventhNumber * percent
                console.log(`${x.user}  ${airDrop.toFixed(18)}`)
            }
        )

        return depositEvents;
    }
}  