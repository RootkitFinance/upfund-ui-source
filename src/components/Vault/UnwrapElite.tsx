import React, { useContext, useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { TokenService } from "../../services/TokenService";
import { useWeb3React } from "@web3-react/core"
import { eliteAddresses, liquidityControllerAddresses } from "../../constants"
import { LiquidityControllerService } from "../../services/LiquidityControllerService"
import ActionModal from "../ActionModal"
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";

const UnwrapElite = ({ isOpen, onDismiss }: { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const { token, eliteTicker } = useContext(ControlCenterContext);

    useEffect(() => {
        const getEliteBalance = async () => setBalance(await new TokenService(token, library, account!).getBalance(liquidityControllerAddresses.get(token)!, eliteAddresses.get(token)!))
        if(isOpen && chainId && supportedChain(chainId!, token)) {
            getEliteBalance()
        }
    }, [token, library, account, isOpen, chainId])

    const unwrapElite = async () => {
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            return await new LiquidityControllerService(token, library, account!).unwrapElite(value)
        }
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={unwrapElite} title={"Unwrap Elite to Base"}>
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={unwrapElite}
                ticker={eliteTicker}
                label={"Amount to unwrap"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"unwrapEliteInput"} />
        </ActionModal>
    )
}

export default UnwrapElite