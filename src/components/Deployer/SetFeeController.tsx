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

const SetFeeController = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [address, setAddress] = useState<string>("")
    const [allow, setAllow] = useState<boolean>(true)

    const setFeeController = async () => {        
        if (address && isAddress(address)) {
            const transferGateService = new TransferGateService(library, account!)
            console.log(allow)
            const txResponse = await transferGateService.setFeeController(address, allow)
            if (txResponse) {
                return await txResponse.wait()
            }
        }
    }

    const close = () => {
        setAddress("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={setFeeController} title={"Set Fee Controller"}>
           <AddressInput value={address} label={"Controller"} onChange={setAddress} />
           <ToggleWrapper>
               <ToggleLabel>Allow</ToggleLabel>
               <Toggle isActive={allow} toggle={() => setAllow(!allow)}/>
           </ToggleWrapper>          
        </ActionModal>
    )
}

export default SetFeeController