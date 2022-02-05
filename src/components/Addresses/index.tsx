import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import { baseAddresses, basePoolAddresses, baseTickers, calculatorAddresses, DEPLOYER_ADDRESS, eliteAddresses, elitePoolAddresses, eliteTickers, factoryAddresses, feeSplitterAddresses, vaultAddresses, rootedAddresses, rootedRouterAddresses, rootedTickers, ROOT_FEEDER_ADDRESS, routerAddresses, routerName, stakingAddresses, stakingTickers, Token, transfetGateAddresses } from "../../constants";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { AddressInfo } from "../../dtos/AddressInfo";
import { ExternalLink } from "../Link";
import Copy from '../AccountDetails/Copy'
import { useWeb3React } from "@web3-react/core";
import { getEtherscanLink, shortenAddress } from "../../utils";

const Wrapper = styled.div`
    display: grid;
    grid-gap: 0.75em;
    width: 100%;
    padding: 1em 0;
` 

const Section = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
    grid-gap: 0.25em;

    :not(:last-child){
        border-bottom: 1px solid ${({ theme }) => theme.text5};  
        padding-bottom: 0.75em;
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

const AddressSection = ({info}:{info: AddressInfo}) => {
    const { chainId } = useWeb3React();
    const theme = useContext(ThemeContext);
    return (
        <>
            <AddressNameLink href={getEtherscanLink(chainId!, info.address, 'address')}>
                <span style={{ marginLeft: '4px' }}>{info.name}</span>
            </AddressNameLink>       
            <AddressLink href={getEtherscanLink(chainId!, info.address, 'address')}>
                <span style={{ marginLeft: '4px' }}>{shortenAddress(info.address)}</span>
            </AddressLink>
            <Copy toCopy={info.address} color={theme.text3}/>
        </>
    )
}

const Addresses = () => {
    const { token } = useContext(ControlCenterContext);
    const [tokens, setTokens] = useState<AddressInfo[]>([]);
    const [pools, setPools] = useState<AddressInfo[]>([]);
    const [system, setSystem] = useState<AddressInfo[]>([]);
    const [swaps, setSwaps] = useState<AddressInfo[]>([]);

    useEffect(() => {
        const baseTiker = baseTickers.get(token)!;
        const eliteTiker = eliteTickers.get(token)!;
        const rootedTiker = rootedTickers.get(token)!;

        const t: AddressInfo[] = [new AddressInfo(baseTiker, baseAddresses.get(token)!)];

        if (token !== Token.upCro ) {
            t.push( new AddressInfo(eliteTiker, eliteAddresses.get(token)!));
        }
        t.push(new AddressInfo(rootedTiker, rootedAddresses.get(token)!));
      
        if (token !== Token.ROOT) {
            t.push(new AddressInfo(stakingTickers.get(token)!, stakingAddresses.get(token)!));
        }
        setTokens(t);

        const p: AddressInfo[] = [];
        if (token !== Token.upTether ) {
            p.push(new AddressInfo(`${baseTiker} / ${rootedTiker} Pool`, basePoolAddresses.get(token)!));
        }
        if (token !== Token.upCro ) {
            p.push(new AddressInfo(`${eliteTiker} / ${rootedTiker} Pool`, elitePoolAddresses.get(token)!));
        }
        setPools(p);

        const s: AddressInfo[] = [ 
            new AddressInfo("Trasfer Gate", transfetGateAddresses.get(token)!),
            new AddressInfo("Floor Calculator", calculatorAddresses.get(token)!),
            new AddressInfo("Vault", vaultAddresses.get(token)!)
        ];

        if (token !== Token.ROOT) {
            s.push(new AddressInfo("Fee Splitter", feeSplitterAddresses.get(token)!));
        }

        if (token === Token.upTether) {
            s.push(new AddressInfo("Rooted Router", rootedRouterAddresses.get(token)!))
        }

        setSystem(s);

        setSwaps([
            new AddressInfo(`${routerName.get(token)!} Router`, routerAddresses.get(token)!),
            new AddressInfo(`${routerName.get(token)!} Factory`, factoryAddresses.get(token)!)
        ]);
        
    }, [token])    

    const deployers: AddressInfo[] = [ 
        new AddressInfo("Deployer", DEPLOYER_ADDRESS),
        new AddressInfo("ROOT Feeder", ROOT_FEEDER_ADDRESS)
    ];


    return (
        <Wrapper>
            <Section>
                {deployers?.map(x => (<AddressSection key={x.address} info={x}/>))}
            </Section>
            <Section>
                {tokens?.map(x => (<AddressSection key={x.address} info={x}/>))}
            </Section>
            <Section>
                {pools.map(x => (<AddressSection key={x.address} info={x}/>))}
            </Section>
            <Section>
                {system.map(x => (<AddressSection key={x.address} info={x}/>))}
            </Section>
            <Section>
                {swaps.map(x => (<AddressSection key={x.address} info={x}/>))}
            </Section>

        </Wrapper>
    )
}

export default Addresses;