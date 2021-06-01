import React, { useContext, useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import { LiquidityControllerService}  from "../../services/LiquidityControllerService";
import { TokenService } from "../../services/TokenService";
import { baseAddresses, liquidityControllerAddresses } from "../../constants";
import CurrencyInput from "../CurrencyInput";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";

const BalancePrice = ({ elite, isOpen, onDismiss } : { elite: boolean, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const { token, baseTicker } = useContext(ControlCenterContext);

    useEffect(() => {
        const getBalance = async () => setBalance(await new TokenService(token, library, account!).getBalance(liquidityControllerAddresses.get(token)!, baseAddresses.get(token)!))
        if (isOpen && chainId && supportedChain(chainId!, token)) {
            getBalance()
        }
    }, [token, library, account, isOpen, chainId])

    const balancePrice = async () => {      
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            const bobberService = new LiquidityControllerService(token, library, account!)
            return elite ? await bobberService.balancePriceElite(value) : await bobberService.balancePriceBase(value)
        }        
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={balancePrice} title={`Balance Price ${elite ? "Elite" : "Base"}`}>
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={balancePrice}
                ticker={baseTicker}
                label={"Arb amount"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"arbInput"} />
        </ActionModal>
    )
}

export default BalancePrice