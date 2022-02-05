import React, { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Erc31337Service } from "../../services/Erc31337Service"
import ActionModal from "../ActionModal"
import CurrencyInput from "../CurrencyInput";
import { CalculatorService } from "../../services/CalculatorService";
import { Token } from "../../constants";
import { supportedChain } from "../../utils";

const UpCroSweepFloor = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [floor, setFloor] = useState<string>("")

    useEffect(() => {
        const getFloor = async () => setFloor(await new CalculatorService(library, account!, Token.upCro).calculateSubFloor())
        if (isOpen && chainId && supportedChain(chainId!, Token.upCro)) {
            getFloor()
        }
    }, [library, account, chainId, isOpen])


    const sweepFloor = async () => {        
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            const erc31337Service = new Erc31337Service(library, account!)
            const txResponse = await erc31337Service.sweepUpCroFloor(value)
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
        <ActionModal isOpen={isOpen} onDismiss={close} action={sweepFloor} title={`Sweep Floor`}>
            <CurrencyInput
                value={value}
                balance={floor}
                onSubmit={sweepFloor}
                ticker={"CRO"}
                label={"Amount to sweep"}
                onMax={() => setValue(floor)}
                showMaxButton={true}
                onUserInput={(x) => setValue(x)}
                id={"sweepInput"} />
        </ActionModal>
    )
}

export default UpCroSweepFloor