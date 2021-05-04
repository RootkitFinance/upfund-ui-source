import React, { useContext, useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { TokenService } from "../../services/TokenService";
import { useWeb3React } from "@web3-react/core"
import { liquidityControllerAddresses } from "../../constants"
import { LiquidityControllerService } from "../../services/LiquidityControllerService"
import ActionModal from "../ActionModal"
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";

const BuyRoot = ({ elite, isOpen, onDismiss } : { elite: boolean, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const { token, baseAddress, eliteAddress, baseTicker, eliteTicker } = useContext(ControlCenterContext);

    useEffect(() => {
        //console.log(`base   ${baseAddress}`)
        //console.log(`elite  ${eliteAddress}`)
        const getKethBalance = async () => {
            if(isOpen && chainId && supportedChain(chainId!, token)) {
                const address = elite ? eliteAddress : baseAddress;
                //console.log(`address ${address}`)
                setBalance(await new TokenService(token, library, account!).getBalance(liquidityControllerAddresses.get(token)!, address))
            }
         
        }
        getKethBalance()
    },[token, library, account, elite, isOpen, chainId])

    const buyRoot = async () => {
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            return await new LiquidityControllerService(token, library, account!).buyRooted(elite ? eliteAddress : baseAddress, value)
        }
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={buyRoot} title={`Buy Rooted with ${elite ? "Elite" : "Base"}`}>
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={buyRoot}
                ticker={elite ? eliteTicker : baseTicker}
                label={"Amount to spend"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"buyRootInput"} />
        </ActionModal>
    )
}

export default BuyRoot