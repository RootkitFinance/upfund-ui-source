import React, { useContext, useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { TokenService } from "../../services/TokenService";
import { useWeb3React } from "@web3-react/core"
import { getTokenByAddress, vaultAddresses } from "../../constants"
import { VaultService } from "../../services/VaultService"
import ActionModal from "../ActionModal"
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";

const BuyRoot = ({ tokenAddress, isOpen, onDismiss } : { tokenAddress: string, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const { token } = useContext(ControlCenterContext);
    const tokenSymbol = getTokenByAddress(tokenAddress)!.symbol

    useEffect(() => {
        const getBalance = async () => {
            if(isOpen && chainId && supportedChain(chainId!, token)) {
                setBalance(await new TokenService(token, library, account!).getBalance(vaultAddresses.get(token)!, tokenAddress))
            }         
        }
        getBalance()
    },[token, library, account, tokenAddress, isOpen, chainId])

    const buyRoot = async () => {
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            return await new VaultService(token, library, account!).buyRooted(tokenAddress, value)
        }
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={buyRoot} title={`Buy Rooted with ${tokenSymbol}`}>
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={buyRoot}
                ticker={tokenSymbol}
                label={"Amount to spend"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"buyRootInput"} />
        </ActionModal>
    )
}

export default BuyRoot