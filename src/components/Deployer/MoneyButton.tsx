import React, { useContext, useEffect, useState } from "react"
import CurrencyInput from "../CurrencyInput"
import { TokenService } from "../../services/TokenService";
import { useWeb3React } from "@web3-react/core"
import { WETH_ADDRESS } from "../../constants"
import { MoneyButtonService } from "../../services/MoneyButtonService"
import ActionModal from "../ActionModal"
import ContentLoader from "react-content-loader";
import styled from "styled-components";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";

const BalanceLoader = () => 
    <ContentLoader
        height={12}
        speed={1}
        animate={true}
        backgroundColor="#f6f6ef"
        foregroundColor="#e8e8e3"
        backgroundOpacity={0.06}
        foregroundOpacity={0.12}
        viewBox="0 0 80 16"
    >
        <rect x="0" y="4" rx="2" ry="2" width="80" height="12" />
    </ContentLoader>

const Profit = styled.div`
    font-size: 0.875em;
    color:  ${({ theme }) => theme.text2};
    display: grid;
    grid-gap: 1em;
    grid-template-columns: auto 1fr;
`

const MoneyButton = ({ rootFirst, isOpen, onDismiss }: { rootFirst: boolean, isOpen: boolean, onDismiss: () => void }) => {
    const { account, library } = useWeb3React()
    const [value, setValue] = useState<string>("")
    const [balance, setBalance] = useState<string>("")
    const [profit, setProfit] = useState<string>("0")
    const [estimating, setEstimating] = useState<boolean>(false)
    const { token } = useContext(ControlCenterContext);

    useEffect(() => {
        const getWethBalance = async () => setBalance(await tokenService.getBalance(account!, WETH_ADDRESS))
        const tokenService = new TokenService(token, library, account!)

        getWethBalance()
    })

    useEffect(() => {
        const estimateProfit = async () => {
            const amount = parseFloat(value)
            if (!Number.isNaN(amount) && amount > 0) {
                setEstimating(true)
                const moneyButtoService = new MoneyButtonService(library, account!)
                setProfit(await moneyButtoService.estimateProfit(rootFirst!, value))
                setEstimating(false)
            }
        }

        const timeout = setTimeout(() => {
            if (value) {
                estimateProfit()
            }
            else {
                setProfit("0")
            }
        }, 1000);

        return () => clearTimeout(timeout)

    }, [value, library, account, rootFirst])

    const gimmeyMoney = async () => {
        const amount = parseFloat(value)
        if (!Number.isNaN(amount) && amount > 0) {
            return await new MoneyButtonService(library, account!).gimmeMoney(rootFirst, value)
        }
    }

    const close = () => {
        setValue("")
        onDismiss()
    }

    return (
        <ActionModal isOpen={isOpen} onDismiss={close} action={gimmeyMoney} title={`WETH 🠖 ${rootFirst ? "ROOT 🠖 KETH" : "KETH 🠖 ROOT"} 🠖 WETH`}>
            <CurrencyInput
                value={value}
                balance={balance}
                onSubmit={gimmeyMoney}
                ticker={"WETH"}
                label={"Amount in"}
                onMax={() => setValue(balance.toString())}
                showMaxButton={true}
                onUserInput={setValue}
                id={"arbInput"} />
            <Profit>
                <div>
                    Estimated profit
                </div>
                <div>
                    {estimating ? <BalanceLoader /> : profit}
                </div>                
            </Profit>
        </ActionModal>
    )
}

export default MoneyButton