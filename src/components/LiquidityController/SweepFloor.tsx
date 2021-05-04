import React, { useContext } from "react"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import { LiquidityControllerService}  from "../../services/LiquidityControllerService";
import styled from "styled-components";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";

const Text = styled.span`
    color: ${({ theme }) => theme.text3};
    font-size: 0.875em;
`

const SweepFloor = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const { token } = useContext(ControlCenterContext);
    
    const sweepFloor = async () => {        
        return await new LiquidityControllerService(token, library, account!).sweepFloor()
    }

    const close = () => {
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={sweepFloor} title={"Sweep Floor"}>
            <Text>Are you sure?</Text>
        </ActionModal>
    )
}

export default SweepFloor