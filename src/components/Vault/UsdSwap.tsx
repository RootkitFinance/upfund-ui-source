import React, { useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import { UpCroVaultService } from "../../services/UpCroVaultService";
import { TokenService } from "../../services/TokenService";
import { rootedAddresses, Token, usdAddresses, vaultAddresses } from "../../constants";
import { supportedChain } from "../../utils";

const UsdSwap = ({ croUsd, isOpen, onDismiss }: { croUsd: boolean, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const token = Token.upCro;

    useEffect(() => {
        const getRootedBalance = async () => setBalance(await new TokenService(token, library, account!).getBalance(vaultAddresses.get(token)!, croUsd ? rootedAddresses.get(token)! : usdAddresses.get(token)!))
        if (isOpen && chainId && supportedChain(chainId!, token)) {
            getRootedBalance()
        }
    }, [library, account, chainId, isOpen])

    const swap = async () => {
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            const servie = new UpCroVaultService(library, account!);
            return croUsd ? await servie.croUsdSwap(value) : await servie.usdCroSwap(value);
        }
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={swap} title={croUsd ? "CRO - USD Swap" : "USD - CRO Swap"}>          
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={swap}
                ticker={croUsd ? "CRO" : "USDC"}
                label={"Amount in"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"swapInput"} />
        </ActionModal>
    )
}

export default UsdSwap