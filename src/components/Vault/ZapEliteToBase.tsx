import React, { useContext, useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { TokenService } from "../../services/TokenService";
import { useWeb3React } from "@web3-react/core"
import { elitePoolAddresses, liquidityControllerAddresses} from "../../constants"
import { LiquidityControllerService } from "../../services/LiquidityControllerService"
import ActionModal from "../ActionModal"
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";

const ZapEliteToBase = ({ isOpen, onDismiss }: { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const { token } = useContext(ControlCenterContext);

    useEffect(() => {
        const getKethBalance = async () => setBalance(await new TokenService(token, library, account!).getBalance(liquidityControllerAddresses.get(token)!, elitePoolAddresses.get(token)!))
        if(isOpen && chainId && supportedChain(chainId!, token)) {
            getKethBalance()
        }
    }, [token, library, account, isOpen, chainId])

    const zapEliteToBase = async () => {
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            return await new LiquidityControllerService(token, library, account!).zapEliteToBase(value)
        }
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={zapEliteToBase} title={"Zap Elite to Base"}>
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={zapEliteToBase}
                ticker={"LP"}
                label={"Liquidity to remove"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"zapEliteToBaseInput"} />
        </ActionModal>
    )
}

export default ZapEliteToBase