import React, { useContext, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import { FeeSplitterService}  from "../../services/FeeSplitterService";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";
import NumberInput from "../NumberInput";


const SetFees = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [burnRate, setBurnRate] = useState<string>("")
    const [sellRate, setSellRate] = useState<string>("")
    const [keepRate, setKeepRate] = useState<string>("")
    const { token, rootedTicker } = useContext(ControlCenterContext);

  
    const setFees = async () => {
        const burnRateNumber = parseFloat(burnRate);
        const sellRateNumber = parseFloat(sellRate);
        const keepRateNumber = parseFloat(keepRate);
        
        if (supportedChain(chainId!, token) && !Number.isNaN(burnRateNumber) && burnRateNumber > 0 && !Number.isNaN(sellRateNumber) && sellRateNumber > 0 && !Number.isNaN(keepRateNumber) && keepRateNumber > 0) {
            return await new FeeSplitterService(token, library, account!).setFees((burnRateNumber*100).toString(), (sellRateNumber*100).toString(), (keepRateNumber*100).toString());
        }        
    }

    const close = () => {
        setBurnRate("")
        setSellRate("")
        setKeepRate("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={setFees} title={`Set Fees for ${rootedTicker}`}>
           <NumberInput   
                value={burnRate}
                onSubmit={() => {}}
                label={"Burn Rate (1-100%)"}
                onUserInput={setBurnRate}
                id={"burnRateInput"} />
             <NumberInput   
                value={sellRate}
                onSubmit={() => {}}
                label={"Sell Rate (1-100%)"}
                onUserInput={setSellRate}
                id={"burnSellInput"} />
            <NumberInput   
                value={keepRate}
                onSubmit={() => {}}
                label={"Keep Rate (1-100%)"}
                onUserInput={setSellRate}
                id={"keepSellInput"} />
        </ActionModal>
    )
}

export default SetFees