import React, { useContext, useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { TokenService } from "../../services/TokenService";
import { useWeb3React } from "@web3-react/core"
import { eliteAddresses, getTokenByAddress, liquidityControllerAddresses } from "../../constants"
import { LiquidityControllerService } from "../../services/LiquidityControllerService"
import ActionModal from "../ActionModal"
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";

const AddLiquidity = ({ tokenAddress, isOpen, onDismiss } : { tokenAddress: string, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const tokenSymbol = getTokenByAddress(tokenAddress)!.symbol;
    const { token } = useContext(ControlCenterContext);

    useEffect(() => {
        const getRootBalance = async () => setBalance(await new TokenService(token, library, account!).getBalance(liquidityControllerAddresses.get(token)!, tokenAddress))
        if (isOpen && chainId && supportedChain(token, chainId!)) {
            getRootBalance()
        }
    }, [token, tokenAddress, library, account, chainId, isOpen])

    const addLiquidity = async () => {
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            return await new LiquidityControllerService(token, library, account!).addLiquidity(tokenAddress, value)
        }
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={addLiquidity} title={`Add ${tokenAddress === eliteAddresses.get(token)! ? "Elite" : "Base"} liquidity`}>
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={addLiquidity}
                ticker={tokenSymbol}
                label={"Amount to add"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"addLiquidityInput"} />
        </ActionModal>
    )
}

export default AddLiquidity