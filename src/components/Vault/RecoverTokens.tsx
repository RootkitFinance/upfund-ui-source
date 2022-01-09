import React, { useContext, useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import { VaultService}  from "../../services/VaultService";
import { getTokenByAddress, vaultAddresses } from "../../constants";
import { TokenService } from "../../services/TokenService";
import styled from "styled-components";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";

const Text = styled.span`
    color: ${({ theme }) => theme.text3};
    font-size: 0.875em;
`

const RecoverTokens = ({ tokenAddress, isOpen, onDismiss } : { tokenAddress: string, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [balance, setBalance] = useState<string>("")
    const tokenSymbol = getTokenByAddress(tokenAddress)!.symbol
    const { token } = useContext(ControlCenterContext);

    useEffect(() => {
        const getBalance = async () => setBalance(await new TokenService(token, library, account!).getBalance(vaultAddresses.get(token)!, tokenAddress))
        if(isOpen && chainId && supportedChain(chainId!, token)) {
            getBalance()
        }
    }, [token, library, account, tokenAddress, isOpen, chainId])

    const recoverTokens = async () => {        
        return await new VaultService(token, library, account!).recoverTokens(tokenAddress)
    }

    const close = () => {
        setBalance("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={recoverTokens} title={`Recover ${tokenSymbol}`}>
            <Text>{`Recover ${balance} ${tokenSymbol}`} </Text>
        </ActionModal>
    )
}

export default RecoverTokens