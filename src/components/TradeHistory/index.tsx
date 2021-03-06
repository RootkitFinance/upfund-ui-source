import { useWeb3React } from "@web3-react/core"
import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { ControlCenterContext } from "../../contexts/ControlCenterContext"
import { TradeHistoryInfo } from "../../dtos/TradeHistoryInfo"
import { TradeHistoryService } from "../../services/TradeHistoryService"
import { supportedChain } from "../../utils"

const Wrapper = styled.div`
    display: grid;
    width: 100%;
    padding: 1em 0 0 0;
    grid-gap: 0.35em;
    font-size: 0.875em;
    font-family: monospace;
    overflow-y: auto;
    max-height: 85vh;
`

const Trade = styled.div`
    display: grid;
    grid-auto-flow:column;
    grid-template-columns: 8em 3em 1fr;
    grid-gap: 1em;
    width: 100%;
`

const TradeType = styled.div<{type: string}>`
    color: ${({ theme, type }) => (type === 'buy' ? theme.green1 : theme.red1)};

`

const TradeHistory = () => {
    const { account, library, chainId } = useWeb3React()
    const [trades, setTrades] = useState<TradeHistoryInfo[]>([])
    const { token } = useContext(ControlCenterContext);
    
    useEffect(() => {
        const addNewTrade = (trade: TradeHistoryInfo) => {
            const existingTrade = trades.find(x => x.date === trade.date && x.amount === trade.amount && x.type === trade.type)
            if (!existingTrade) {
                setTrades((trades) => [trade, ...trades])
            }            
        }

        const getTrades = async () => {
            if (supportedChain(chainId!, token)) {
                const tradeHistoryService = new TradeHistoryService(token, library, account!)
                setTrades(await tradeHistoryService.getTrades())
                tradeHistoryService.onSwap(addNewTrade)
            }           
        }        
        getTrades()

    }, [account, library, chainId, token])

    return (
    <Wrapper>
        {trades.map((x,i) => (
            <Trade key={i}>
                <span>{x.date}</span>
                <TradeType type={x.type}>{x.type}</TradeType>
                <span>{x.amount}</span>
            </Trade>))}
    </Wrapper>)
}

export default TradeHistory;