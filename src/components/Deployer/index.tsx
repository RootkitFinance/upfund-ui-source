import React, { useState } from "react"
import styled from "styled-components"
import { KETH_ADDRESS, KETH_ROOT_POOL_ADDRESS, ROOT_ADDRESS, WETH_ADDRESS, WETH_ROOT_POOL_ADDRESS, WRAPPED_KETH_ROOT_LP_ADDRESS, WRAPPED_WETH_ROOT_LP_ADDRESS } from "../../constants"
import { ButtonPrimary, ButtonPrimaryRed, ButtonPrimaryGreen } from "../Button"
import AllowPool from "./AllowPool"
import MoneyButton from "./MoneyButton"
import SendTokens from "./SendToken"
import SetDumpTax from "./SetDumpTax"
import SetFeeController from "./SetFeeController"
import SetFreeParticipant from "./SetFreeParticipant"
import SetSellStakeRateMultiplier from "./SetSellStakeRateMultiplier"
import SetSweeper from "./SetSweeper"
import SetUnrestrictedController from "./SetUnrestrictedController"
import SweepFloor from "./SweepFloor"
import Transfer from "./Transfer"

const Wrapper = styled.div`
    display: grid;
    grid-gap: 1em;
    width: 100%;
    padding: 1em 0 0 0;
`

const SectionWrapper = styled.div`
:not(:last-child){
    border-bottom: 1px solid ${({ theme }) => theme.text5};  
    padding-bottom: 1em;
  }
`
const SectionContent = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 1em;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: repeat(3, 1fr);
  `};
`
const SectionHeader = styled.div`
  padding-left: 0.25em;
  padding-bottom: 1em;  
  color: ${({ theme }) => theme.text3};
`

const Deployer = () => {
    const [rootKethArbOpen, setRootKethArbOpen] = useState<boolean>(false)
    const [kethRootArbOpen, setKethRootArbOpen] = useState<boolean>(false)
    const [allowPoolOpen, setAllowPoolOpen] = useState<boolean>(false)
    const [unrestrictedControllerOpen, setUnrestrictedControllerOpen] = useState<boolean>(false)
    const [feeControllerOpen, setFeeControllerOpen] = useState<boolean>(false)
    const [freeParticipantOpen, setFreeParticipantOpen] = useState<boolean>(false)
    const [sellStakeRateMultiplierOpen, setSellStakeRateMultiplier] = useState<boolean>(false)
    const [dumpTaxOpen, setDumpTaxOpen] = useState<boolean>(false)
    const [sweepKethFloorOpen, setSweepKethFloorOpen] = useState<boolean>(false)
    const [sweepKethLpFloorOpen, setSweepKethLpFloorOpen] = useState<boolean>(false)
    const [sweepWethLpFloorOpen, setSweepWethLpFloorOpen] = useState<boolean>(false)
    const [sweeperOpen, setSweeperOpen] = useState<boolean>(false)
    const [transferOpen, setTransferOpen] = useState<boolean>(false)
    const [sendTokensOpen, setSendTokensOpen] = useState<boolean>(false)
    const [transferTokenAddress, setTransferTokenAddress] = useState<string>(WETH_ADDRESS)

    const transfer = (address: string) =>
    {
        setTransferTokenAddress(address)
        setTransferOpen(true)
    }

    return (
        <Wrapper>
            <MoneyButton isOpen={rootKethArbOpen} rootFirst={true} onDismiss={() => setRootKethArbOpen(false)} />
            <MoneyButton isOpen={kethRootArbOpen} rootFirst={false} onDismiss={() => setKethRootArbOpen(false)} />
            <AllowPool isOpen={allowPoolOpen} onDismiss={() => setAllowPoolOpen(false)} />
            <SetUnrestrictedController  isOpen={unrestrictedControllerOpen} onDismiss={() => setUnrestrictedControllerOpen(false)} />
            <SetFeeController  isOpen={feeControllerOpen} onDismiss={() => setFeeControllerOpen(false)} />
            <SetFreeParticipant isOpen={freeParticipantOpen} onDismiss={() => setFreeParticipantOpen(false)} />
            <SetSellStakeRateMultiplier isOpen={sellStakeRateMultiplierOpen} onDismiss={() => setSellStakeRateMultiplier(false)} />
            <SetDumpTax isOpen={dumpTaxOpen} onDismiss={() => setDumpTaxOpen(false)} />
            <SweepFloor tokenAddress={KETH_ADDRESS} isOpen={sweepKethFloorOpen} onDismiss={() => setSweepKethFloorOpen(false)} />
            <SweepFloor tokenAddress={WRAPPED_KETH_ROOT_LP_ADDRESS} isOpen={sweepKethLpFloorOpen} onDismiss={() => setSweepKethLpFloorOpen(false)} />
            <SweepFloor tokenAddress={WRAPPED_WETH_ROOT_LP_ADDRESS} isOpen={sweepWethLpFloorOpen} onDismiss={() => setSweepWethLpFloorOpen(false)} />
            <SetSweeper isOpen={sweeperOpen} onDismiss={() => setSweeperOpen(false)} />
            <SendTokens isOpen={sendTokensOpen} onDismiss={() => setSendTokensOpen(false)} />
            <Transfer tokenAddress={transferTokenAddress} isOpen={transferOpen} onDismiss={() => setTransferOpen(false)}/>

            <SectionWrapper>
                <SectionHeader>Transfer gate</SectionHeader>
                <SectionContent>
                    <ButtonPrimary onClick={() => setAllowPoolOpen(true)}>Allow Pool</ButtonPrimary>
                    
                    <ButtonPrimary onClick={() => setUnrestrictedControllerOpen(true)}>Set Unrestricted Controller</ButtonPrimary>
                    <ButtonPrimary onClick={() => setFeeControllerOpen(true)}>Set Fee Controller</ButtonPrimary>
                    <ButtonPrimary onClick={() => setFreeParticipantOpen(true)}>Set Free Participant</ButtonPrimary>
                    <ButtonPrimary onClick={() => setSellStakeRateMultiplier(true)}>Set Sell Rate Multiplier</ButtonPrimary>
                    <ButtonPrimary onClick={() => setDumpTaxOpen(true)}>Set Dump Tax</ButtonPrimary>
                </SectionContent>
            </SectionWrapper>

            <SectionWrapper>
                <SectionHeader>KETH</SectionHeader>
                <SectionContent>
                    <ButtonPrimary onClick={() => setSweepKethFloorOpen(true)}>Sweep KETH Floor</ButtonPrimary>
                    <ButtonPrimary onClick={() => setSweeperOpen(true)}>Set Sweeper</ButtonPrimary>
                    <ButtonPrimaryGreen disabled={true}>Deposit WETH</ButtonPrimaryGreen>
                    <ButtonPrimaryRed disabled={true}>Withdraw</ButtonPrimaryRed>
                </SectionContent>
            </SectionWrapper>

            <SectionWrapper>
                <SectionHeader>{"Wrapped LP"}</SectionHeader>
                <SectionContent>
                    <ButtonPrimary onClick={() => setSweepWethLpFloorOpen(true)}>Sweep WETH LP Floor</ButtonPrimary>
                    <ButtonPrimary onClick={() => setSweepKethLpFloorOpen(true)}>Sweep KETH LP Floor</ButtonPrimary>
                </SectionContent>               
            </SectionWrapper>

            <SectionWrapper>
                <SectionHeader>Vault</SectionHeader>
                <SectionContent>
                    <ButtonPrimary onClick={() => setSendTokensOpen(true)}>Send Tokens</ButtonPrimary>
                </SectionContent>                
            </SectionWrapper>

            <SectionWrapper>
                <SectionHeader>Transfer</SectionHeader>
                <SectionContent>
                    <ButtonPrimary onClick={() => transfer(WETH_ADDRESS)}>WETH</ButtonPrimary>
                    <ButtonPrimary onClick={() => transfer(KETH_ADDRESS)}>KETH</ButtonPrimary>
                    <ButtonPrimary onClick={() => transfer(ROOT_ADDRESS)}>ROOT</ButtonPrimary>
                    <ButtonPrimary onClick={() => transfer(WETH_ROOT_POOL_ADDRESS)}>WETH LP</ButtonPrimary>
                    <ButtonPrimary onClick={() => transfer(KETH_ROOT_POOL_ADDRESS)}>KETH LP</ButtonPrimary>
                </SectionContent>
            </SectionWrapper>

        </Wrapper>)
}

export default Deployer;