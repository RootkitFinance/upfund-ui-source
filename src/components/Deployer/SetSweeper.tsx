import React, { useContext, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Erc31337Service } from "../../services/Erc31337Service"
import ActionModal from "../ActionModal"
import { isAddress } from "../../utils";
import AddressInput from "../AddressInput"
import Toggle from "../Toggle";
import styled from "styled-components";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { eliteAddresses } from "../../constants";

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

const SetSweeper = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [address, setAddress] = useState<string>("")
    const [allow, setAllow] = useState<boolean>(true)
    const { token } = useContext(ControlCenterContext);
    
    const setSweeper = async () => {        
        if (address && isAddress(address)) {
            return await new Erc31337Service(library, account!).setSweeper(eliteAddresses.get(token)!, address, allow)  
        }
    }

    const close = () => {
        setAddress("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={setSweeper} title={"Set Sweeper"}>
           <AddressInput value={address} label={"Sweeper"} onChange={setAddress} />
           <ToggleWrapper>
               <ToggleLabel>Allow</ToggleLabel>
               <Toggle isActive={allow} toggle={() => setAllow(!allow)}/>
           </ToggleWrapper>          
        </ActionModal>
    )
}

export default SetSweeper