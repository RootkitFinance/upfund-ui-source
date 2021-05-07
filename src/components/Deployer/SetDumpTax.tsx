import React, { useContext, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { TransferGateService } from "../../services/TransferGateService"
import ActionModal from "../ActionModal"
import NumberInput from "../NumberInput"
import { ControlCenterContext } from "../../contexts/ControlCenterContext"

const SetDumpTax = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [rate, setRate] = useState<string>("")
    const [duration, setDuration] = useState<string>("")
    const { token } = useContext(ControlCenterContext);

    const setDumpTax = async () => {        
        const rateNumber = parseFloat(rate);
        const durationNumber = parseFloat(duration);
        if (!Number.isNaN(rateNumber) && rateNumber > 0 && !Number.isNaN(durationNumber) && durationNumber > 0) {
            const transferGateService = new TransferGateService(token, library, account!)
            const txResponse = await transferGateService.setDumpTax((rateNumber*100).toString(), duration);
            if (txResponse) {
                return await txResponse.wait()
            }
        }
    }

    const close = () => {
        setRate("");
        setDuration("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={setDumpTax} title={"Set Dump Tax"}>
           <NumberInput   
                value={rate}
                onSubmit={setDumpTax}
                label={"Start Tax Rate (1-25%)"}
                onUserInput={setRate}
                id={"rateInput"} />
            <NumberInput   
                value={duration}
                onSubmit={setDumpTax}
                label={"Duration in Seconds"}
                onUserInput={setDuration}
                id={"durationInput"} />
        </ActionModal>
    )
}

export default SetDumpTax