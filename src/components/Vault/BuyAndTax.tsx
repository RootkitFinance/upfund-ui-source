import React, { useContext, useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { TokenService } from "../../services/TokenService";
import { useWeb3React } from "@web3-react/core"
import { baseAddresses, getTokenByAddress, Token, vaultAddresses } from "../../constants"
import { VaultService } from "../../services/VaultService"
import ActionModal from "../ActionModal"
import NumberInput from "../NumberInput";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";
import { UpCroVaultService } from "../../services/UpCroVaultService";

const BuyAndTax = ({ tokenAddress, isOpen, onDismiss } : { tokenAddress: string, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [rate, setRate] = useState<string>("")
    const [duration, setDuration] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const tokenSymbol = getTokenByAddress(tokenAddress)!.symbol;
    const { token } = useContext(ControlCenterContext);

    useEffect(() => {
        const getBalance = async () => setBalance(await new TokenService(token, library, account!).getBalance(vaultAddresses.get(token)!, tokenAddress))
        if(isOpen && chainId && supportedChain(chainId!, token)) {
            getBalance()
        }
    }, [token, tokenAddress, library, account, isOpen, chainId])

    const buyAndTax = async () => {
        const amount = parseFloat(value);
        const rateNumber = parseFloat(rate);
        const durationNumber = parseFloat(duration);

        if (!Number.isNaN(amount) && amount > 0 && !Number.isNaN(rateNumber) && rateNumber > 0 && !Number.isNaN(durationNumber) && durationNumber > 0) {
            return token === Token.upCro 
                ? await new UpCroVaultService(library, account!).buyAndTax(value, (rateNumber*100).toString(), duration) 
                : await new VaultService(token, library, account!).buyAndTax(tokenAddress, value, (rateNumber*100).toString(), duration);
        }
    }

    const close = () => {
        setValue("");
        setRate("");
        setDuration("");
        onDismiss();
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={buyAndTax} title={`Buy and Tax ${tokenAddress === baseAddresses.get(token)! ? "Base" : "Elite"}`}>
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={buyAndTax}
                ticker={tokenSymbol}
                label={"Amount to spend"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"amountToSpendInput"} />
            <NumberInput   
                value={rate}
                onSubmit={buyAndTax}
                label={"Start Tax Rate (1-100%)"}
                onUserInput={setRate}
                id={"rateInput"} />
            <NumberInput   
                value={duration}
                onSubmit={buyAndTax}
                label={"Duration in Seconds"}
                onUserInput={setDuration}
                id={"durationInput"} />
        </ActionModal>
    )
}

export default BuyAndTax