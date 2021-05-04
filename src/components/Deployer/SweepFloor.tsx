import React, { useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Erc31337Service } from "../../services/Erc31337Service"
import ActionModal from "../ActionModal"
import { isAddress } from "../../utils";
import AddressInput from "../AddressInput"
import { getTokenByAddress } from "../../constants";

const SweepFloor = ({ tokenAddress, isOpen, onDismiss } : { tokenAddress: string, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [toAddress, setToAddress] = useState<string>("")
    const tokenSymbol = getTokenByAddress(tokenAddress)?.symbol

    const sweepFloor = async () => {        
        if (toAddress && isAddress(toAddress)) {
            const erc31337Service = new Erc31337Service(library, account!)
            const txResponse = await erc31337Service.sweepFloor(tokenAddress, toAddress)
            if (txResponse) {
                return await txResponse.wait()
            }
        }
    }

    const close = () => {
        setToAddress("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={sweepFloor} title={`Sweep ${tokenSymbol} Floor`}>
           <AddressInput value={toAddress} label={"Sweep to"} onChange={setToAddress} />
        </ActionModal>
    )
}

export default SweepFloor