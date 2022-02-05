import React, { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import CurrencyInput from "../CurrencyInput";
import { CalculatorService } from "../../services/CalculatorService";
import { Token } from "../../constants";
import { supportedChain } from "../../utils";
import { UpCroVaultService } from "../../services/UpCroVaultService";

const UpCroSweepFloor = ({ sweep, isOpen, onDismiss } : { sweep: boolean, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [floor, setFloor] = useState<string>("")

    useEffect(() => {
        const getFloor = async () => {
            const service = new CalculatorService(library, account!, Token.upCro);
            setFloor(sweep ? await service.calculateSubFloor() : await service.getSweptAmount())
        
        }
        if (isOpen && chainId && supportedChain(chainId!, Token.upCro)) {
            getFloor()
        }
    }, [library, account, chainId, isOpen])

    const sweepFloor = async () => {        
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            const service = new UpCroVaultService(library, account!)
            const txResponse = sweep ? await service.sweepFloor(value) : await service.unsweepFloor(value)
            if (txResponse) {
                return await txResponse.wait()
            }
        }
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={sweepFloor} title={sweep ? "Sweep Floor" : "Unsweep Floor"}>
            <CurrencyInput
                value={value}
                balance={floor}
                balanceLabel={sweep ? "Floor" : "Swept"}
                onSubmit={sweepFloor}
                ticker={"CRO"}
                label={sweep ? "Amount to sweep" : "Amount to unsweep"}
                onMax={() => setValue(floor)}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"sweepInput"} />
        </ActionModal>
    )
}

export default UpCroSweepFloor