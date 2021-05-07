import React, { useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { TransferGateService } from "../../services/TransferGateService"
import ActionModal from "../ActionModal"
import { isAddress } from "../../utils";
import AddressInput from "../AddressInput"
import { Token } from "../../constants";

const AllowPool = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [tokenAddress, setTokenAddress] = useState<string>("")

    const allowPool = async () => {        
        if (isAddress(tokenAddress)) {
            return await new TransferGateService(Token.ROOT, library, account!).allowPool(tokenAddress)
        }
    }

    const close = () => {
        setTokenAddress("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={allowPool} title={"Allow Pool"}>
           <AddressInput value={tokenAddress} label={"Token Address"} onChange={setTokenAddress} />
        </ActionModal>
    )
}

export default AllowPool