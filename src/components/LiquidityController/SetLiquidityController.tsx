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

const SetLiquidityController = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [address, setAddress] = useState<string>("")
    const [isController, setIsController] = useState<boolean>(true)
    const { token } = useContext(ControlCenterContext);

    const setLiquidityController = async () => {        
        if (address && isAddress(address)) {
            return await new LiquidityControllerService(token, library, account!).setLiquidityController(address, isController)
        }
    }

    const close = () => {
        setAddress("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={setLiquidityController} title={"Set Liquidity Controller"}>
           <AddressInput value={address} label={"Controller"} onChange={setAddress} />
           <ToggleWrapper>
               <ToggleLabel>Liquidity Controller</ToggleLabel>
               <Toggle isActive={isController} toggle={() => setIsController(!isController)}/>
           </ToggleWrapper>          
        </ActionModal>
    )
}

export default SetLiquidityController