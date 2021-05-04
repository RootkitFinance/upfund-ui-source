import React, { useContext, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import ActionModal from "../ActionModal"
import { isAddress } from "../../utils";
import AddressInput from "../AddressInput"
import { LiquidityControllerService } from "../../services/LiquidityControllerService";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";

const Calibrate = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [base, setBase] = useState<string>("")
    const [rooted, setRooted] = useState<string>("")
    const [elite, setElite] = useState<string>("")
    const [gate, setGate] = useState<string>("")
    const [calculator, setCalculator] = useState<string>("")
    const { token } = useContext(ControlCenterContext);
  
    const calibrate = async () => {     
        if (base && isAddress(base) && rooted && isAddress(rooted) && elite && isAddress(elite) && gate && isAddress(gate) && calculator && isAddress(calculator)) {
            const bobberService = new LiquidityControllerService(token, library, account!)
            const txResponse = await bobberService.calibrate(base, rooted, elite, calculator, gate)
            if (txResponse) {
                return await txResponse.wait()
            }
        }
    }

    const close = () => {
        setBase("")
        setRooted("")
        setElite("")
        setGate("")
        setCalculator("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={calibrate} title={"Calibrate"}>
           <AddressInput value={base} label={"Base Token"} onChange={setBase} />
           <AddressInput value={rooted} label={"Rooted Token"} onChange={setRooted} />
           <AddressInput value={elite} label={"Elite Token"} onChange={setElite} />
           <AddressInput value={calculator} label={"Floor Calculator"} onChange={setCalculator} />
           <AddressInput value={gate} label={"Rooted Transfer Gate"} onChange={setGate} />
        </ActionModal>
    )
}

export default Calibrate