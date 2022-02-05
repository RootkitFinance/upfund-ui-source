import React from "react"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import styled from "styled-components";
import { UpCroVaultService } from "../../services/UpCroVaultService";

const Text = styled.span`
    color: ${({ theme }) => theme.text3};
    font-size: 0.875em;
`

const ReduceLockedLiquidity = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()

    const reduceLockedLiquidity = async () => {        
        return await new UpCroVaultService(library, account!).reduceLockedLiquidity()
    }

    const close = () => {
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={reduceLockedLiquidity} title={"Reduce Locked Liquidity"}>
            <Text>Are you sure?</Text>
        </ActionModal>
    )
}

export default ReduceLockedLiquidity