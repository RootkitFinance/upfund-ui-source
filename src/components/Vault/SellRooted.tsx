import React, { useContext, useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { TokenService } from "../../services/TokenService";
import { useWeb3React } from "@web3-react/core"
import { getTokenByAddress, vaultAddresses, rootedAddresses, Token } from "../../constants"
import { VaultService } from "../../services/VaultService"
import ActionModal from "../ActionModal"
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";
import { UpCroVaultService } from "../../services/UpCroVaultService";

const SellRooted = ({ tokenAddress, isOpen, onDismiss } : { tokenAddress: string, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const { token, rootedTicker } = useContext(ControlCenterContext);
    const tokenSymbol = getTokenByAddress(tokenAddress)!.symbol

    useEffect(() => {
        const getRootedBalance = async () => setBalance(await new TokenService(token, library, account!).getBalance(vaultAddresses.get(token)!, rootedAddresses.get(token)!))
        if (isOpen && chainId && supportedChain(chainId!, token)) {
            getRootedBalance()
        }
    }, [token, library, account, chainId, isOpen])

    const sellRooted = async () => {
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            return token === Token.upCro 
            ? await new UpCroVaultService(library, account!).sellRooted(value)            
            : await new VaultService(token, library, account!).sellRooted(tokenAddress, value)
        }
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={sellRooted} title={`Sell Rooted for ${tokenSymbol}`}>
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={sellRooted}
                ticker={rootedTicker}
                label={"Amount to sell"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"sellRootedInput"} />
        </ActionModal>
    )
}

export default SellRooted