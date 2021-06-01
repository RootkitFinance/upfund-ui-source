import React, { useContext, useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { TokenService } from "../../services/TokenService";
import { useWeb3React } from "@web3-react/core"
import { liquidityControllerAddresses, baseAddresses } from "../../constants"
import { LiquidityControllerService } from "../../services/LiquidityControllerService"
import ActionModal from "../ActionModal"
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";

const WrapToElite = ({ isOpen, onDismiss }: { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const { token, baseTicker } = useContext(ControlCenterContext);

    useEffect(() => {
        const getWethBalance = async () => setBalance(await new TokenService(token, library, account!).getBalance(liquidityControllerAddresses.get(token)!, baseAddresses.get(token)!))
        if(isOpen && chainId && supportedChain(chainId!, token)) {
            getWethBalance()
        }
    }, [token, library, account, isOpen, chainId])

    const wrapToElite = async () => {
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            return await new LiquidityControllerService(token, library, account!).wrapToElite(value)
        }
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={wrapToElite} title={"Wrap Base to Elite"}>
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={wrapToElite}
                ticker={baseTicker}
                label={"Amount to wrap"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"wrapToEliteInput"} />
        </ActionModal>
    )
}

export default WrapToElite