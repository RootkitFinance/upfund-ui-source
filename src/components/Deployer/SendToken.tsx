import React, { useState } from "react"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import { isAddress } from "../../utils";
import AddressInput from "../AddressInput"
import CurrencyInput from "../CurrencyInput";
import { VaultService } from "../../services/VaultService";

const SendTokens = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [tokenAddress, setTokenAddress] = useState<string>("")
    const [recipient, setRecipient] = useState<string>("")

    const transfer = async () => {     
        const amount = parseFloat(value)   
        if (!Number.isNaN(amount) && amount > 0 && recipient && isAddress(recipient)) {
            const vaultService = new VaultService(library, account!)
            const txResponse = await vaultService.sendToken(tokenAddress, recipient, value)
            if (txResponse) {
                return await txResponse.wait()
            }
        }
    }

    const close = () => {
        setTokenAddress("")
        setRecipient("")
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={transfer} title={"Send tokens"}>
           <AddressInput value={tokenAddress} label={"Token"} onChange={setTokenAddress} />
           <AddressInput value={recipient} label={"Recipient"} onChange={setRecipient} />
           <CurrencyInput
                value={value}
                onSubmit={transfer}
                ticker={""}
                label={"Amount"}
                showMaxButton={false}
                onUserInput={setValue}
                id={"vaultInput"} />
        </ActionModal>
    )
}

export default SendTokens