import { useWeb3React } from "@web3-react/core"
import React, { useContext, useState } from "react"
import styled from "styled-components"
import { Token } from "../../constants"
import { ControlCenterContext } from "../../contexts/ControlCenterContext"
import { supportedChain } from "../../utils"
import { ButtonPrimary } from "../Button"
import AllowPool from "./AllowPool"
import SetDumpTax from "./SetDumpTax"
import SetFeeController from "./SetFeeController"
import SetFees from "./SetFees"
import SetFreeParticipant from "./SetFreeParticipant"
import SetPoolTaxRate from "./SetPoolTaxRate"
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
    const { token, baseTicker, eliteTicker, rootedTicker, baseAddress, eliteAddress, rootedAddress, basePoolAddress, elitePoolAddress } = useContext(ControlCenterContext);
    const { chainId } = useWeb3React()
    const [allowPoolOpen, setAllowPoolOpen] = useState<boolean>(false)
    const [unrestrictedControllerOpen, setUnrestrictedControllerOpen] = useState<boolean>(false)
    const [feeControllerOpen, setFeeControllerOpen] = useState<boolean>(false)
    const [freeParticipantOpen, setFreeParticipantOpen] = useState<boolean>(false)
    const [poolTaxRateOpen, setPoolTaxRateOpen] = useState<boolean>(false)
    const [feesOpen, setFeesOpen] = useState<boolean>(false)
    const [dumpTaxOpen, setDumpTaxOpen] = useState<boolean>(false)
    const [sweepFloorOpen, setSweepFloorOpen] = useState<boolean>(false)
    const [sweeperOpen, setSweeperOpen] = useState<boolean>(false)
    const [transferOpen, setTransferOpen] = useState<boolean>(false)
    const [transferTokenAddress, setTransferTokenAddress] = useState<string>(baseAddress)

    const transfer = (address: string) =>
    {
        setTransferTokenAddress(address)
        setTransferOpen(true)
    }

    return (
        <Wrapper>
            <AllowPool isOpen={allowPoolOpen} onDismiss={() => setAllowPoolOpen(false)} />
            <SetUnrestrictedController isOpen={unrestrictedControllerOpen} onDismiss={() => setUnrestrictedControllerOpen(false)} />
            <SetFeeController isOpen={feeControllerOpen} onDismiss={() => setFeeControllerOpen(false)} />
            <SetFreeParticipant isOpen={freeParticipantOpen} onDismiss={() => setFreeParticipantOpen(false)} />
            <SetPoolTaxRate isOpen={poolTaxRateOpen} onDismiss={() => setPoolTaxRateOpen(false)} />
            <SetFees isOpen={feesOpen} onDismiss={() => setFeesOpen(false)} />
            <SetDumpTax isOpen={dumpTaxOpen} onDismiss={() => setDumpTaxOpen(false)} />
            <SweepFloor tokenAddress={eliteAddress} isOpen={sweepFloorOpen} onDismiss={() => setSweepFloorOpen(false)} />
            <SetSweeper isOpen={sweeperOpen} onDismiss={() => setSweeperOpen(false)} />            
            <Transfer tokenAddress={transferTokenAddress} isOpen={transferOpen} onDismiss={() => setTransferOpen(false)}/>

            <SectionWrapper>
                <SectionHeader>Transfer gate</SectionHeader>
                <SectionContent>
                    {token === Token.ROOT && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setAllowPoolOpen(true)}>Allow Pool</ButtonPrimary>}                    
                    <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setUnrestrictedControllerOpen(true)}>Set Unrestricted Controller</ButtonPrimary>
                    <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setFeeControllerOpen(true)}>Set Fee Controller</ButtonPrimary>
                    <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setFreeParticipantOpen(true)}>Set Free Participant</ButtonPrimary>
                    <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setPoolTaxRateOpen(true)}>Set Pool Tax Rate</ButtonPrimary>
                    {token !== Token.ROOT && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setFeesOpen(true)}>Set Fees</ButtonPrimary>}
                    <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setDumpTaxOpen(true)}>Set Dump Tax</ButtonPrimary>
                </SectionContent>
            </SectionWrapper>

            <SectionWrapper>
                <SectionHeader>Elite ({eliteTicker})</SectionHeader>
                <SectionContent>
                    <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setSweepFloorOpen(true)}>Sweep Floor</ButtonPrimary>
                    <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setSweeperOpen(true)}>Set Sweeper</ButtonPrimary>
                </SectionContent>
            </SectionWrapper>

            <SectionWrapper>
                <SectionHeader>Transfer</SectionHeader>
                <SectionContent>
                    <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => transfer(baseAddress)}>{baseTicker}</ButtonPrimary>
                    <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => transfer(eliteAddress)}>{eliteTicker}</ButtonPrimary>
                    <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => transfer(rootedAddress)}>{rootedTicker}</ButtonPrimary>
                    <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => transfer(basePoolAddress)}>{baseTicker} LP</ButtonPrimary>
                    <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => transfer(elitePoolAddress)}>{eliteTicker} LP</ButtonPrimary>
                </SectionContent>
            </SectionWrapper>

        </Wrapper>)
}

export default Deployer;