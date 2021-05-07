import React, { useContext, useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import { isAddress, supportedChain } from "../../utils";
import AddressInput from "../AddressInput"
import CurrencyInput from "../CurrencyInput";
import { getTokenByAddress } from "../../constants";
import { TokenService } from "../../services/TokenService";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";

const Transfer = ({ tokenAddress, isOpen, onDismiss } : { tokenAddress: string, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const [recipient, setRecipient] = useState<string>("")
    const tokenSymbol = getTokenByAddress(tokenAddress)!.symbol
    const { token } = useContext(ControlCenterContext);

    useEffect(() => {
        const getBalance = async () => setBalance(await new TokenService(token, library, account!).getBalance(account!, tokenAddress))
       
        if (isOpen && chainId && supportedChain(chainId!, token)) {
            getBalance()
        }
    }, [token, tokenAddress, library, account, chainId, isOpen])

    const transfer = async () => {     
        const amount = parseFloat(value)   
        if (!Number.isNaN(amount) && amount > 0 && recipient && isAddress(recipient)) {
            const tokenService = new TokenService(token,library, account!)
            const txResponse = await tokenService.transfer(tokenAddress, recipient, value)
            if (txResponse) {
                return await txResponse.wait()
            }
        }
    }

    const close = () => {
        setRecipient("")
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={transfer} title={`Transfer ${tokenSymbol}`}>
           <AddressInput value={recipient} label={"Recipient"} onChange={setRecipient} />
           <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={transfer}
                ticker={tokenSymbol}
                label={"Amount"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={setValue}
                id={"transferInput"} />

        </ActionModal>
    )
}

export default Transfer