import React, { useContext, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { TransferGateService } from "../../services/TransferGateService"
import ActionModal from "../ActionModal"
import NumberInput from "../NumberInput"
import { ControlCenterContext } from "../../contexts/ControlCenterContext"

const SetFees = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [feesRate, setFeesRate] = useState<string>("")
    const { token } = useContext(ControlCenterContext);

    const setFees = async () => {        
        const amount = parseFloat(feesRate)   
        if (!Number.isNaN(amount) && amount > 0) {
            const transferGateService = new TransferGateService(token, library, account!)
            const txResponse = await transferGateService.setFees(feesRate)
            if (txResponse) {
                return await txResponse.wait()
            }
        }
    }

    const close = () => {
        setFeesRate("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={setFees} title={"Set Sell Fees"}>
           <NumberInput   
                value={feesRate}
                onSubmit={setFees}
                label={"Fees rate (1-100%)"}
                onUserInput={setFeesRate}
                id={"feesInput"} />
        </ActionModal>
    )
}

export default SetFees