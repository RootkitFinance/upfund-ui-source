import React, { useContext, useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import { FeeSplitterService}  from "../../services/FeeSplitterService";
import { TokenService } from "../../services/TokenService";
import styled from "styled-components";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";

const Text = styled.span`
    color: ${({ theme }) => theme.text3};
    font-size: 0.875em;
`

const PayFees = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [balance, setBalance] = useState<string>("0")
    const { token, rootedTicker } = useContext(ControlCenterContext);

    useEffect(() => {
        const getBalance = async () => setBalance(await new TokenService(token, library, account!).getFeeSplitterBalance())
        if(isOpen && chainId && supportedChain(chainId!, token)) {
            getBalance()
        }
    }, [token, library, account, isOpen, chainId])

    const payFees = async () => {
        if (supportedChain(chainId!, token)) {
            return await new FeeSplitterService(token, library, account!).payFees()
        }        
    }

    const close = () => {
        setBalance("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={payFees} title={`Pay ${rootedTicker} Fees`}>
            <Text>{parseFloat(balance) > 0? `Pay Fees ${balance} ${rootedTicker}` : "Nothing to pay"} </Text>
        </ActionModal>
    )
}

export default PayFees