import React, { useContext, useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { TokenService } from "../../services/TokenService";
import { useWeb3React } from "@web3-react/core"
import { eliteAddresses, vaultAddresses } from "../../constants"
import { VaultService } from "../../services/VaultService"
import ActionModal from "../ActionModal"
import NumberInput from "../NumberInput";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";

const RemoveBuyAndTax = ({ tokenAddress, lpAddress, isOpen, onDismiss } : { tokenAddress: string, lpAddress: string, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [rate, setRate] = useState<string>("")
    const [duration, setDuration] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const { token } = useContext(ControlCenterContext);

    useEffect(() => {
        const getLpBalance = async () => setBalance(await new TokenService(token, library, account!).getBalance(vaultAddresses.get(token)!, lpAddress))
        if(isOpen && chainId && supportedChain(chainId!, token)) {
            getLpBalance()
        }
    }, [token, library, account, lpAddress, isOpen, chainId])

    const removeBuyAndTax = async () => {
        const amount = parseFloat(value);
        const rateNumber = parseFloat(rate);
        const durationNumber = parseFloat(duration);

        if (!Number.isNaN(amount) && amount > 0 && !Number.isNaN(rateNumber) && rateNumber > 0 && !Number.isNaN(durationNumber) && durationNumber > 0) {
            return await new VaultService(token, library, account!).removeBuyAndTax(value, tokenAddress, (rateNumber*100).toString(), duration)
        }
    }

    const close = () => {
        setValue("");
        setRate("");
        setDuration("");
        onDismiss();
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={removeBuyAndTax} title={`Remove Buy and Tax ${tokenAddress === eliteAddresses.get(token)!  ? "Elite" : "Base"}`}>
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={removeBuyAndTax}
                ticker={"LP"}
                label={"LP to remove"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"removeLpInput"} />
            <NumberInput   
                value={rate}
                onSubmit={removeBuyAndTax}
                label={"Start Tax Rate (1-100%)"}
                onUserInput={setRate}
                id={"rateInput"} />
            <NumberInput   
                value={duration}
                onSubmit={removeBuyAndTax}
                label={"Duration in Seconds"}
                onUserInput={setDuration}
                id={"durationInput"} />
        </ActionModal>
    )
}

export default RemoveBuyAndTax