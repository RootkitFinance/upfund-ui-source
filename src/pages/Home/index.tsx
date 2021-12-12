import { useWeb3React } from "@web3-react/core"
import React from "react"
import styled from "styled-components"
import Balances from "../../components/Balances"
import Vault from "../../components/Vault"
import Deployer from "../../components/Deployer"
import TradeHistory from "../../components/TradeHistory"
import Addresses from "../../components/Addresses"
import Fees from "../../components/Fees"

const Wrapper = styled.div`
    display: grid;
    grid-template-areas: "vault trades addresses balances" "deployer trades fees balances";
    grid-template-columns: 1.6fr 0.65fr 0.5fr 0.75fr;
    padding: 0 1em 1em 1em;
    grid-gap: 1em;
    width: 100%;

   ${({ theme }) => theme.mediaWidth.upToMedium`
        grid-template-areas: "vault" "deployer" "trades" "addresses" "fees" "balances";
        grid-template-columns: auto;
   `};
`

const Section = styled.div`
    background: ${({ theme }) => theme.bg1};
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 8px 12px rgba(0, 0, 0, 0.04),
    0px 12px 16px rgba(0, 0, 0, 0.01);
    border-radius: 1.25em;
    color: ${({ theme }) => theme.text2};
    padding: 1em;
`

const SectionHeader = styled.div`
    padding: 0 0.25em 0.15em 0.1em;
    color: ${({ theme }) => theme.text3};
    border-bottom: 1px solid ${({ theme }) => theme.text3};
    text-transform: uppercase;
`

const VaultSection = styled(Section)`
    grid-area: vault;
`

const DeployerSection = styled(Section)`
    grid-area: deployer;
`

const TradeHistorySection = styled(Section)`
    grid-area: trades;
`

const BalancesSection = styled(Section)`
    grid-area: balances;
`

const AddressesSection = styled(Section)`
    grid-area: addresses;
`

const FeesSection = styled(Section)`
    grid-area: fees;
`

export const Home = () => {
    const { account, library, chainId } = useWeb3React()   

    return (
        account && library && chainId ?
        <Wrapper>
            <VaultSection>
                <SectionHeader>Vault</SectionHeader>
                <Vault />
            </VaultSection>
            <DeployerSection>
                <SectionHeader>Deployer</SectionHeader>
                <Deployer />
            </DeployerSection>
            <TradeHistorySection>
                <SectionHeader>Trade History</SectionHeader>
                <TradeHistory />
            </TradeHistorySection>
            <AddressesSection>
                <SectionHeader>Addresses</SectionHeader>
                <Addresses />
            </AddressesSection>
            <FeesSection>
                <SectionHeader>Fees</SectionHeader>
                <Fees />             
            </FeesSection>
            <BalancesSection>
                <SectionHeader>Balances</SectionHeader>
                <Balances />
            </BalancesSection>
        </Wrapper>
        : null      
    )
}