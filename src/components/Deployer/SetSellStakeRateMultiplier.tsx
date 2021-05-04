import React, { useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { TransferGateService } from "../../services/TransferGateService"
import ActionModal from "../ActionModal"
import NumberInput from "../NumberInput"

const SetSellStakeRateMultiplier = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [multiplier, setMultiplier] = useState<string>("")

    const setSellStakeRateMultiplier = async () => {        
        const amount = parseFloat(multiplier)   
        if (!Number.isNaN(amount) && amount > 0) {
            const transferGateService = new TransferGateService(library, account!)
            const txResponse = await transferGateService.setSellStakeRateMultiplier(multiplier)
            if (txResponse) {
                return await txResponse.wait()
            }
        }
    }

    const close = () => {
        setMultiplier("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={setSellStakeRateMultiplier} title={"Set Sell Stake Rate Multiplier"}>
           <NumberInput   
                value={multiplier}
                onSubmit={setSellStakeRateMultiplier}
                label={"Multiplier (1-20)"}
                onUserInput={setMultiplier}
                id={"vaultInput"} />
        </ActionModal>
    )
}

export default SetSellStakeRateMultiplier