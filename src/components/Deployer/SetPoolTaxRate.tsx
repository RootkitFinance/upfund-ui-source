import React, { useContext, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import { isAddress } from "../../utils";
import AddressInput from "../AddressInput"
import { TransferGateService } from "../../services/TransferGateService";
import NumberInput from "../NumberInput";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";

const SetPoolTaxRate = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [taxRate, setTaxRate] = useState<string>("")
    const [poolAddress, setPoolAddress] = useState<string>("")
    const { token } = useContext(ControlCenterContext);

    const setPoolTaxRate = async () => {     
        const rate = parseFloat(taxRate)   
        if (!Number.isNaN(rate) && rate > 0 && poolAddress && isAddress(poolAddress)) {
            const service = new TransferGateService(token, library, account!)
            const txResponse = await service.setPoolTaxRate(poolAddress, (rate*100).toString())
            if (txResponse) {
                return await txResponse.wait()
            }
        }
    }

    const close = () => {
        setPoolAddress("")
        setTaxRate("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={setPoolTaxRate} title={"Send tokens"}>
           <AddressInput value={poolAddress} label={"Pool"} onChange={setPoolAddress} />
           <NumberInput   
                value={taxRate}
                onSubmit={setPoolTaxRate}
                label={"Tax rate (1-100%)"}
                onUserInput={setTaxRate}
                id={"taxInput"} />
        </ActionModal>
    )
}

export default SetPoolTaxRate