import React, { useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { TransferGateService } from "../../services/TransferGateService"
import ActionModal from "../ActionModal"
import { isAddress } from "../../utils";
import AddressInput from "../AddressInput"
import Toggle from "../Toggle";
import styled from "styled-components";

const ToggleWrapper = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 1em;  
    align-items: center;  
`

const ToggleLabel = styled.span`
    color: ${({ theme }) => theme.text3};
    font-size: 0.875em;
    padding-left: 1em;
`

const SetFreeParticipant = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [address, setAddress] = useState<string>("")
    const [free, setFree] = useState<boolean>(true)

    const setFreeParticipant = async () => {        
        if (address && isAddress(address)) {           
            return await new TransferGateService(library, account!).setFreeParticipant(address, free)
        }
    }

    const close = () => {
        setAddress("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={setFreeParticipant} title={"Set Free Participant"}>
           <AddressInput value={address} label={"Participant"} onChange={setAddress} />
           <ToggleWrapper>
               <ToggleLabel>Free</ToggleLabel>
               <Toggle isActive={free} toggle={() => setFree(!free)}/>
           </ToggleWrapper>          
        </ActionModal>
    )
}

export default SetFreeParticipant