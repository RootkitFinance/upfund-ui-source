import React, { useContext, useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { TokenService } from "../../services/TokenService";
import { useWeb3React } from "@web3-react/core"
import { eliteAddresses, vaultAddresses } from "../../constants"
import { VaultService } from "../../services/VaultService"
import ActionModal from "../ActionModal"
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";

const RemoveLiquidity = ({ tokenAddress, lpAddress, isOpen, onDismiss } : { tokenAddress: string, lpAddress:string, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const { token } = useContext(ControlCenterContext);

    useEffect(() => {
        const getLpBalance = async () => setBalance(await new TokenService(token, library, account!).getBalance(vaultAddresses.get(token)!, lpAddress))
        if(isOpen && chainId && supportedChain(chainId!, token)) {
            getLpBalance()
        }
    }, [token, library, account, lpAddress, isOpen, chainId])

    const removeLiquidity = async () => {
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            return await new VaultService(token, library, account!).removeLiquidity(tokenAddress, value)
        }
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={removeLiquidity} title={`Remove ${tokenAddress === eliteAddresses.get(token)! ? "Elite" : "Base"} liquidity`}>
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={removeLiquidity}
                ticker={"LP"}
                label={"Amount to remove"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"removeLiquidityInput"} />
        </ActionModal>
    )
}

export default RemoveLiquidity