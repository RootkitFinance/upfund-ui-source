import { useWeb3React } from "@web3-react/core"
import React, { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import Balances from "../../components/Balances"
import LiquidityController from "../../components/LiquidityController"
import Deployer from "../../components/Deployer"
import TradeHistory from "../../components/TradeHistory"
import { Token } from "../../constants"
import { ControlCenterContext } from "../../contexts/ControlCenterContext"

const Wrapper = styled.div`
    display: grid;
    grid-template-areas: "liquidity-controller trades balances" "deployer trades balances";
    grid-template-columns: 2.1fr 0.65fr 0.75fr;
    padding: 0 1em 1em 1em;
    grid-gap: 1em;
    width: 100%;

   ${({ theme }) => theme.mediaWidth.upToMedium`
        grid-template-areas: "liquidity-controller" "deployer" "trades" "balances";
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

const LiquidityControllerSection = styled(Section)`
    grid-area: liquidity-controller;
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

export const Home = () => {
    const { account, library, chainId } = useWeb3React()
    const { token } = useParams<{ token: string }>();
    const { setToken } = useContext(ControlCenterContext);

    useEffect(() => {
        if (!token) {
            setToken(Token.ROOT);
            return;
        }
        const tokenParameter = token.toLowerCase();
        if(tokenParameter === "uptether") {
            setToken(Token.upTether);
            return;
        }

        if(tokenParameter === "upbnb") {
            setToken(Token.upBNB);
            return;
        }

        setToken(Token.ROOT);

    })

    return (
        account && library && chainId
            ?
            (
                <Wrapper>
                    <LiquidityControllerSection>
                        <SectionHeader>Liquidity Controller</SectionHeader>
                         <LiquidityController />
                    </LiquidityControllerSection>
                    <DeployerSection>
                        <SectionHeader>Deployer</SectionHeader>
                        <Deployer/> 
                    </DeployerSection>
                    <TradeHistorySection>
                        <SectionHeader>Trade History</SectionHeader>
                        <TradeHistory />
                    </TradeHistorySection>
                    <BalancesSection>
                        <SectionHeader>Balances</SectionHeader>
                        <Balances />
                    </BalancesSection>
                </Wrapper>
            )
            : null
    )
}