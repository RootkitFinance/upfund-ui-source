import React, { useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import { isAddress } from "../../utils";
import { UpCroVaultService } from "../../services/UpCroVaultService";
import AddressInput from "../AddressInput";

const Swap = ({ empire, isOpen, onDismiss }: { empire: boolean, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [tokenIn, setTokenIn] = useState<string>("")
    const [tokenOut, setTokenOut] = useState<string>("")

    const swap = async () => {
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0 && tokenIn && isAddress(tokenIn) && tokenOut && isAddress(tokenOut)) {
            const servie = new UpCroVaultService(library, account!);
            return empire ? await servie.empireSwap(tokenIn, tokenOut, value) : await servie.altRouterSwap(tokenIn, tokenOut, value);
        }
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={swap} title={empire ? "Empire Swap" : "VVS Swap"}>
            <AddressInput value={tokenIn} label={"Token In"} onChange={setTokenIn} />
            <AddressInput value={tokenOut} label={"Token Out"} onChange={setTokenOut} />
            <CurrencyInput
                value={value}
                balance={""}
                onSubmit={swap}
                ticker={""}
                label={"Amount in"}
                onMax={() =>{}}
                showMaxButton={false}
                onUserInput={(x) => setValue(x)}
                id={"swapInput"} />
        </ActionModal>
    )
}

export default Swap