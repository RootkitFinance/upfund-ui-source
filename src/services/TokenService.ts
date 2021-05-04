import { Contract } from '@ethersproject/contracts'
import erc20Abi from '../constants/abis/erc20.json'
import { Web3Provider } from '@ethersproject/providers'
import { AddressBalanceInfo } from '../dtos/AddressBalanceInfo';
import { 
    DEPLOYER_ADDRESS, 
    BUY_BACK_ADDRESS, 
    IGNORE_ADDRESS, 
    VAULT_ADDRESS, 
    getTokenByAddress, Token, baseAddresses, eliteAddresses, rootedAddresses, basePoolAddresses, elitePoolAddresses, liquidityControllerAddresses
} from '../constants';
import { TokenBalanceInfo } from '../dtos/TokenBalanceInfo';
import BigNumber from 'bignumber.js';
import { getDisplayBalance } from '../utils/formatBalance';
import { TokenInfo } from '../dtos/TokenInfo';
import { PoolInfo } from '../dtos/PoolInfo';
import { parseEther } from '@ethersproject/units'
import { PriceInfo } from '../dtos/PriceInfo';

export class TokenService {

    private addressToTokensMap: Map<string, TokenInfo[]>
    private tokenToContractMap: Map<string, Contract>
    private token: Token;
    private baseToken: TokenInfo;
    private eliteToken: TokenInfo;
    private rootedToken: TokenInfo;
    private basePoolToken: TokenInfo;
    private elitePoolToken: TokenInfo;

    public constructor(token: Token, library: Web3Provider, account: string){
        this.token = token;
        this.baseToken = getTokenByAddress(baseAddresses.get(token)!)!;
        this.eliteToken = getTokenByAddress(eliteAddresses.get(token)!)!;
        this.rootedToken = getTokenByAddress(rootedAddresses.get(token)!)!;
        this.basePoolToken = getTokenByAddress(basePoolAddresses.get(token)!)!;
        this.elitePoolToken = getTokenByAddress(elitePoolAddresses.get(token)!)!;

        this.addressToTokensMap = new Map<string, TokenInfo[]>()
        this.addressToTokensMap.set(eliteAddresses.get(token)!, [ this.baseToken ])
        this.addressToTokensMap.set(DEPLOYER_ADDRESS, [ this.baseToken, this.eliteToken, this.rootedToken, this.basePoolToken, this.elitePoolToken ])
        this.addressToTokensMap.set(BUY_BACK_ADDRESS,  [ this.baseToken, this.rootedToken ])
        this.addressToTokensMap.set(IGNORE_ADDRESS, [ this.rootedToken ])
        this.addressToTokensMap.set(VAULT_ADDRESS, [ this.baseToken ])        
        this.addressToTokensMap.set(liquidityControllerAddresses.get(token)!, [ this.baseToken, this.eliteToken, this.rootedToken, this.basePoolToken, this.elitePoolToken ])

        this.tokenToContractMap = new Map<string, Contract>()
        const signer = library.getSigner(account).connectUnchecked();
        this.tokenToContractMap.set(this.baseToken.address, new Contract(this.baseToken.address, erc20Abi, signer))
        this.tokenToContractMap.set(this.eliteToken.address, new Contract(this.eliteToken.address, erc20Abi, signer))
        this.tokenToContractMap.set(this.rootedToken.address, new Contract(this.rootedToken.address, erc20Abi, signer))
        this.tokenToContractMap.set(this.basePoolToken.address, new Contract(this.basePoolToken.address, erc20Abi, signer))
        this.tokenToContractMap.set(this.elitePoolToken.address, new Contract(this.elitePoolToken.address, erc20Abi, signer))
    }

    public async getBalance(account: string, tokenAddress: string) {
       
       // try{
            const balance = await this.tokenToContractMap.get(tokenAddress)!.balanceOf(account)
            const token = getTokenByAddress(tokenAddress)!;
            return  getDisplayBalance(new BigNumber(balance.toString()), token.decimals)
        // }
        // catch(e)
        // {
        //     console.log(this.token);
        //     console.log(`tokenAddress ${tokenAddress}`)
        //     console.log(`baseToken ${this.baseToken.address}`)
        //     console.log(`eliteToken ${this.eliteToken.address}`)
        //     return "0";
        // }
        
    }

    public getEmptyBalances() {
        const addressBalances: AddressBalanceInfo[] = []
        addressBalances.push(new AddressBalanceInfo("Liquidity Controller", liquidityControllerAddresses.get(this.token)!, this.addressToTokensMap.get(liquidityControllerAddresses.get(this.token)!)!.map(x => new TokenBalanceInfo(x, "0"))))
        
        addressBalances.push(new AddressBalanceInfo("Deployer", DEPLOYER_ADDRESS, this.addressToTokensMap.get(DEPLOYER_ADDRESS)!.map(x => new TokenBalanceInfo(x, "0"))))    
        //addressBalances.push(new AddressBalanceInfo("KETH", KETH_ADDRESS, this.addressToTokensMap.get(KETH_ADDRESS)!.map(x => new TokenBalanceInfo(x, "0"))))
        //addressBalances.push(new AddressBalanceInfo("Buy Back", BUY_BACK_ADDRESS, this.addressToTokensMap.get(BUY_BACK_ADDRESS)!.map(x => new TokenBalanceInfo(x, "0"))))
       // addressBalances.push(new AddressBalanceInfo("Ignore", IGNORE_ADDRESS, this.addressToTokensMap.get(IGNORE_ADDRESS)!.map(x => new TokenBalanceInfo(x, "0"))))
        //addressBalances.push(new AddressBalanceInfo("Vault", VAULT_ADDRESS, this.addressToTokensMap.get(VAULT_ADDRESS)!.map(x => new TokenBalanceInfo(x, "0"))))
        

        return addressBalances
    }

    public async getAllBalances() {       
        const addressBalances: AddressBalanceInfo[] = this.getEmptyBalances()
        for (let i = 0; i < addressBalances.length; i++)
        {
            for(let j = 0; j < addressBalances[i].balances.length; j++)
            {
                const tokenAddress = addressBalances[i].balances[j].token.address
                const balance = await this.tokenToContractMap.get(tokenAddress)!.balanceOf(addressBalances[i].address)
                addressBalances[i].balances[j].balance = getDisplayBalance(new BigNumber(balance.toString()), addressBalances[i].balances[j].token.decimals)
            }
        }

        return addressBalances
    }

    public async getAddressBalances(address: string) {
        const tokens = this.addressToTokensMap.get(address)!
        const balances: TokenBalanceInfo[] = []
        for(let i = 0; i < tokens.length; i++)
        {
            const balance = await this.tokenToContractMap.get(tokens[i].address)!.balanceOf(address)
           
            balances.push(new TokenBalanceInfo(tokens[i], getDisplayBalance(new BigNumber(balance.toString()), tokens[i].decimals)))
        }

        return balances
    }

    public async getBasePoolInfo() {
        return this.getPoolInfo(basePoolAddresses.get(this.token)!, baseAddresses.get(this.token)!)
    }

    public async getElitePoolInfo() {
        return this.getPoolInfo(elitePoolAddresses.get(this.token)!, eliteAddresses.get(this.token)!)
    }

    public async getPoolInfo(poolAddress: string, tokenAddress: string) {
        const rootContract = this.tokenToContractMap.get(rootedAddresses.get(this.token)!)!
        const tokenContract = this.tokenToContractMap.get(tokenAddress)!
        const rootBalance = new BigNumber((await rootContract.balanceOf(poolAddress)).toString())
        const tokenBalance = new BigNumber((await tokenContract.balanceOf(poolAddress)).toString())
        const token = getTokenByAddress(tokenAddress)!;
        let rootPrice = tokenBalance.dividedBy(rootBalance)
        if(this.token === Token.upTether)
        {
            rootPrice = rootPrice.multipliedBy(new BigNumber(10).pow(12))
        }
        const pairContract = this.tokenToContractMap.get(poolAddress)!
        const lpBalance = await new BigNumber((await pairContract.totalSupply()).toString())

        return new PoolInfo(
            getTokenByAddress(tokenAddress)!,
            getDisplayBalance(tokenBalance, token.decimals), 
            getDisplayBalance(new BigNumber(rootBalance.toString())),
            getDisplayBalance(new BigNumber(lpBalance.toString())),
            rootPrice.toFixed(4))
    }

    public async transfer(tokenAddress: string, recipient: string, amount: string) {
        const tokenContract = this.tokenToContractMap.get(tokenAddress)!    
        return await tokenContract.transfer(recipient, parseEther(amount))
    }

    public async getPrices() {
        const basePoolInfo =  await this.getBasePoolInfo();
        const elitePoolInfo =  await this.getElitePoolInfo();
        return new PriceInfo(basePoolInfo.rootPrice, elitePoolInfo.rootPrice)
    }
}