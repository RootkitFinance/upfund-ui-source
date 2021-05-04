import { useWeb3React } from "@web3-react/core";
import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components"
import { AddressBalanceInfo } from "../../dtos/AddressBalanceInfo";
import { TokenService } from "../../services/TokenService";
import { getEtherscanLink, shortenAddress, supportedChain } from "../../utils";
import { ExternalLink } from "../Link";
import Copy from '../AccountDetails/Copy'
import ContentLoader from "react-content-loader";
import { LinkStyledButton } from "../Button";
import { RefreshCw } from 'react-feather'
import { TokenBalanceInfo } from "../../dtos/TokenBalanceInfo";
import { PoolInfo } from "../../dtos/PoolInfo";
import { TokenInfo } from "../../dtos/TokenInfo";
import { basePoolAddresses, getTokenByAddress, baseAddresses, eliteAddresses, elitePoolAddresses, calculatorAddresses } from "../../constants";
import { CalculatorService } from "../../services/CalculatorService";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";

const Wrapper = styled.div`
    display: grid;
    grid-gap: 0.75em;
    height: 100%;
    width: 100%;
    padding: 1em 0;
` 

const SectionWrapper = styled.div`
    display: grid;
    grid-gap: 0.25em;

    :not(:last-child){
        border-bottom: 1px solid ${({ theme }) => theme.text5};  
        padding-bottom: 1em;
      }
`

const AddressLink = styled(ExternalLink)`
  font-size: 0.825rem;
  font-family: monospace;
  color: ${({ theme }) => theme.text3};
  margin-left: 1rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.text2};
  } 
`

const AddressNameLink = styled(ExternalLink)`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.text3};
  display: flex;
  :hover {
    color: ${({ theme }) => theme.text2};
  } 
`

const HeaderWrapper = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: auto auto auto 1fr;
    grid-gap: 0.5em;
    align-items:center;
    padding-bottom: 1em;
`

const BalancesWrapper = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 5em;
    grid-column-gap: 1em;
    justify-items: end;
    align-items: center;
    padding: 0 0.5em;
    font-size: 0.825rem;
    font-family: monospace;
`

const BalancesWrapperWithCaption = styled(BalancesWrapper)`
grid-template-columns: 1fr 6em 5em;
`

const Ticker = styled.div`
    justify-self: start;
`

const BalanceLoader = () => (
    <ContentLoader
    height={12}
    speed={1}
    animate={true}
    backgroundColor="#f6f6ef"
    foregroundColor="#e8e8e3"
    backgroundOpacity={0.06}
    foregroundOpacity={0.12}
    viewBox="0 0 80 16"
  >
    <rect x="0" y="4" rx="2" ry="2" width="80" height="12" />
  </ContentLoader>)

const RefreshButton = styled(LinkStyledButton)`
  color: ${({ theme }) => theme.text3};
  text-decoration: none;
  font-size: 0.875rem;
  :hover
  {
    text-decoration: none;
    color: ${({ theme }) => theme.text2};
  }
`

const RefreshIcon = styled.span`
  margin-right: 0.25rem;
  font-size: 0.875rem;
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
`

const Error = styled.div`
    color: ${({ theme }) => theme.red1};
    justify-self:start;
`;

const SectionHeader = ({name, address, onRefresh} : {name: string, address:string, onRefresh: () => void })=> {
    const { chainId } = useWeb3React()
    const theme = useContext(ThemeContext)

    return (
      <HeaderWrapper> 
        <AddressNameLink href={getEtherscanLink(chainId!, address, 'address')}>
            <span style={{ marginLeft: '4px' }}>{name}</span>
        </AddressNameLink>       
        <AddressLink href={getEtherscanLink(chainId!, address, 'address')}>
            <span style={{ marginLeft: '4px' }}>{shortenAddress(address)}</span>
        </AddressLink>
        <Copy toCopy={address} color={theme.text3}/>
        <RefreshButton onClick={onRefresh}>
            <RefreshIcon>
                <RefreshCw size={'16'}/>
            </RefreshIcon>
        </RefreshButton>        
    </HeaderWrapper>
    )
}

const AddressBalances = ({info, globalLoading, valid}:{info: AddressBalanceInfo, globalLoading: boolean, valid: boolean}) => {
    const { account, library, chainId } = useWeb3React()
    const [loading, setLoading] = useState<boolean>(false)
    const [addressBalances, setAddressBalances] = useState<TokenBalanceInfo[]>([])
    const { token } = useContext(ControlCenterContext)

    useEffect(() => {
        setAddressBalances(info.balances)
    }, [info.balances, token, chainId])

    const refreshBalance = async () => {        
        if (library && account && chainId && supportedChain(chainId!, token)) {
            const service = new TokenService(token, library, account!)
            setLoading(true)           
            setAddressBalances(await service.getAddressBalances(info.address))
            setLoading(false)
        }
    }

    return (
    <SectionWrapper>       
        <SectionHeader name={info.name} address={info.address} onRefresh={refreshBalance} /> 
        {addressBalances?.map(x=>(
            <BalancesWrapper key={x.token.symbol}>
                <div>
                    {loading || globalLoading || !valid
                    ? <BalanceLoader/> 
                    : x.balance}
                </div>
                <Ticker>{x.token.symbol}</Ticker> 
            </BalancesWrapper>))}        
    </SectionWrapper>)
}

const PoolBalances = ({ poolToken, poolAddress, valid } : {poolToken: TokenInfo, poolAddress: string, valid: boolean}) => {
    const { account, library, chainId } = useWeb3React()
    const [loading, setLoading] = useState<boolean>(false)
    const [poolInfo, setPoolInfo] = useState<PoolInfo>()
    const { token, rootedTicker } = useContext(ControlCenterContext)
    
    const getPoolInfo = async () =>{
        if (library && account && chainId && supportedChain(chainId!, token)) {      
            const service = new TokenService(token, library, account!)      
            setLoading(true)           
            setPoolInfo(await service.getPoolInfo(poolAddress, poolToken.address))
            setLoading(false)
        }
    }

    useEffect(() => {           
        const getPoolInfo = async () => {           
            if (library && account && chainId && supportedChain(chainId!, token)) {  
                const service = new TokenService(token, library, account!)              
                setLoading(true)           
                setPoolInfo(await service.getPoolInfo(poolAddress, poolToken.address))
                setLoading(false)
            }
        }       
        getPoolInfo()        
    }, [library, account, chainId, token, valid])

    return (
        <SectionWrapper>
             <SectionHeader name={`${poolToken.symbol} / ${rootedTicker} Pool`} address={poolAddress} onRefresh={getPoolInfo} /> 
             <BalancesWrapper>
                <div>{loading || !valid ? <BalanceLoader/> : poolInfo?.tokenBalance}</div>
                <Ticker>{poolToken.symbol}</Ticker>
            </BalancesWrapper>
            <BalancesWrapper>
                <div>{loading || !valid ? <BalanceLoader/> : poolInfo?.rootBalance}</div>
                <Ticker>{rootedTicker}</Ticker>
            </BalancesWrapper>
            <BalancesWrapper>
                <div>{loading || !valid ? <BalanceLoader/> : poolInfo?.lpBalance}</div>
                <Ticker>LP</Ticker>
            </BalancesWrapper>
            <BalancesWrapper>                
                <div>1 {rootedTicker} = {loading || !valid ? <BalanceLoader/> : poolInfo?.rootPrice}</div>
                <Ticker>{poolToken.symbol}</Ticker> 
            </BalancesWrapper>
        </SectionWrapper>
    )
}

const TwoPoolCalculatorSubFloor = ({ valid } : {valid: boolean}) => {
    const { account, library, chainId } = useWeb3React()
    const [loading, setLoading] = useState<boolean>(false)
    const [subFloor, setSubFloor] = useState<string>()
    const { token, baseTicker } = useContext(ControlCenterContext)

    const calculateSubfloor = async () =>{
        if (library && account && chainId && supportedChain(chainId!, token)) {      
            const service = new CalculatorService(library, account!, token)      
            setLoading(true)           
            setSubFloor(await service.calculatorSubFloor())
            setLoading(false)
        }
    }

    useEffect(() => {           
        const calculateSubfloor = async () => {           
            if (library && account && chainId && supportedChain(chainId!, token)) {  
                const service = new CalculatorService(library, account!, token)      
                setLoading(true)           
                setSubFloor(await service.calculatorSubFloor())
                setLoading(false)
            }
        }       
        calculateSubfloor()
    }, [library, account, chainId, token, valid])

    return (
        <SectionWrapper>
            <SectionHeader name={"Floor Calculator"} address={calculatorAddresses.get(token)!} onRefresh={calculateSubfloor} /> 
            <BalancesWrapperWithCaption>
                <div>Sub Floor</div>
                {loading || !valid ? <BalanceLoader/> : subFloor === "ERROR" ? (<Error>MISSING</Error>) : <div>{subFloor}</div>}
                <Ticker>{!loading && subFloor === "ERROR" ? "" : baseTicker}</Ticker>                
            </BalancesWrapperWithCaption>            
        </SectionWrapper>
    )
}

const Balances = () => {
    const { account, library, chainId } = useWeb3React()
    const [balances, setBalances] = useState<AddressBalanceInfo[]>()
    const [loading, setLoading] = useState<boolean>(true)
    const [valid, setLValid] = useState<boolean>(false)
    const { token } = useContext(ControlCenterContext)
    const basePoolAddress = basePoolAddresses.get(token)!;
    const baseToken = getTokenByAddress(baseAddresses.get(token)!)!;
    const elitePoolAddress = elitePoolAddresses.get(token)!;
    const eliteToken = getTokenByAddress(eliteAddresses.get(token)!)!;

    useEffect(() => {       

        const getBalances = async () => {
            if (library && account && chainId && supportedChain(chainId!, token)){
                const service = new TokenService(token, library, account!)
                setLoading(true)           
                setBalances(await service.getAllBalances())
                setLoading(false)
            }
        }

        if(library && account){
            const service = new TokenService(token, library, account!)
            setBalances(service.getEmptyBalances())
            getBalances()
        }
        setLValid(supportedChain(chainId!, token))
    }, [library, account, chainId, token])

    return (
    <Wrapper>
        {balances?.map(x => (<AddressBalances key={x.address} globalLoading={loading} info={x} valid={valid}/>)) }
        <PoolBalances poolToken={baseToken} poolAddress={basePoolAddress} valid={valid}/>
        <TwoPoolCalculatorSubFloor valid={valid}/>      
        {false ? <> 
        
            <PoolBalances poolToken={baseToken} poolAddress={basePoolAddress} valid={valid}/>
        <PoolBalances poolToken={eliteToken} poolAddress={elitePoolAddress} valid={valid}/> 
         
        </> : null}
        
    </Wrapper>)
}

export default Balances;