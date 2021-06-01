import React, { useContext, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { LiquidityControllerService } from "../../services/LiquidityControllerService"
import ActionModal from "../ActionModal"
import { isAddress } from "../../utils";
import AddressInput from "../AddressInput"
import Toggle from "../Toggle";
import styled from "styled-components";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";

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

const SetSeniorVaultManager = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [address, setAddress] = useState<string>("")
    const [isManager, setIsManager] = useState<boolean>(true)
    const { token } = useContext(ControlCenterContext);

    const setLiquidityController = async () => {        
        if (address && isAddress(address)) {
            return await new LiquidityControllerService(token, library, account!).setLiquidityController(address, isManager)
        }
    }

    const close = () => {
        setAddress("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={setLiquidityController} title={"Set Senior Vault Manager"}>
           <AddressInput value={address} label={"Manager"} onChange={setAddress} />
           <ToggleWrapper>
               <ToggleLabel>Senior Vault Manager</ToggleLabel>
               <Toggle isActive={isManager} toggle={() => setIsManager(!isManager)}/>
           </ToggleWrapper>          
        </ActionModal>
    )
}

export default SetSeniorVaultManager