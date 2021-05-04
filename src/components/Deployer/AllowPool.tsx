import React, { useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { TransferGateService } from "../../services/TransferGateService"
import ActionModal from "../ActionModal"
import { isAddress } from "../../utils";
import AddressInput from "../AddressInput"

const AllowPool = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [token, setToken] = useState<string>("")

    const allowPool = async () => {        
        if (isAddress(token)) {
            return await new TransferGateService(library, account!).allowPool(token)
        }
    }

    const close = () => {
        setToken("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={allowPool} title={"Allow Pool"}>
           <AddressInput value={token} label={"Token Address"} onChange={setToken} />
        </ActionModal>
    )
}

export default AllowPool