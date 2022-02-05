import React, { useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { TokenService } from "../../services/TokenService";
import { useWeb3React } from "@web3-react/core"
import { baseAddresses, rootedAddresses, Token, vaultAddresses } from "../../constants"
import { UpCroVaultService } from "../../services/UpCroVaultService"
import ActionModal from "../ActionModal"
import { supportedChain } from "../../utils";

const UpCroAddLiquidity = ({ isOpen, onDismiss } : { isOpen: boolean, onDismiss: () => void }) => {
    const { account, library, chainId } = useWeb3React()
    const [baseValue, setBaseValue] = useState<string>("")
    const [rootedValue, setRootedValue] = useState<string>("")
    const [baseBalance, setBaseBalance] = useState<string>("")
    const [rootedBalance, setRootedBalance] = useState<string>("")
    const token = Token.upCro;

    useEffect(() => {
        const getBalance = async () =>  {
            setBaseBalance(await new TokenService(token, library, account!).getBalance(vaultAddresses.get(token)!, baseAddresses.get(token)!));
            setRootedBalance(await new TokenService(token, library, account!).getBalance(vaultAddresses.get(token)!, rootedAddresses.get(token)!))
        }
        if (isOpen && chainId && supportedChain(chainId!, token)) {
            getBalance()
        }
    }, [token, library, account, chainId, isOpen])

    const addLiquidity = async () => {
        const baseAmount = parseFloat(baseValue);
        const rootedAmount = parseFloat(rootedValue);
        if (!Number.isNaN(baseAmount) && baseAmount > 0 && !Number.isNaN(rootedAmount) && rootedAmount > 0) {
            return await new UpCroVaultService(library, account!).addLiquidity(baseValue, rootedValue)
        }
    }

    const close = () => {
        setBaseValue("")
        setRootedValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={addLiquidity} title={`Add Base liquidity`}>
            <CurrencyInput
                value={baseValue}
                balance={baseBalance}
                onSubmit={addLiquidity}
                ticker="CRO"
                label="Base amount to add"
                onMax={() => setBaseValue(baseBalance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setBaseValue(x)}
                id={"addBaseLiquidityInput"} />
            <CurrencyInput
                value={rootedValue}
                balance={rootedBalance}
                onSubmit={addLiquidity}
                ticker="upCRO"
                label="Rooted amount to add"
                onMax={() => setRootedValue(rootedBalance.toString())}
                showMaxButton={true}
                onUserInput={(x) => setRootedValue(x)}
                id="addRootedLiquidityInput" />
        </ActionModal>
    )
}

export default UpCroAddLiquidity