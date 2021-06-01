import React, { useContext, useEffect, useState } from 'react'
import styled from "styled-components"
import ContentLoader from "react-content-loader";
import { PriceInfo } from '../../dtos/PriceInfo'
import { useWeb3React } from '@web3-react/core';
import { TokenService } from '../../services/TokenService';
import { ControlCenterContext } from '../../contexts/ControlCenterContext';
import { Token } from '../../constants';

const Wrapper = styled.div`
    display: grid;
    font-size: 0.875em;
    grid-gap: 0.25em;
    color: ${({ theme }) => theme.text2}; 
    padding-right:1em;
    font-family:monospace;
`

const BalanceLoader = () => (
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
  </ContentLoader>)

export default function PriceStatus()
{
    const [priceStatus, setPriceStatus] = useState<PriceInfo>()
    const [loading, setLoading] = useState<boolean>(false)

    const { account, library, chainId } = useWeb3React()
    const { token, baseTicker, eliteTicker } = useContext(ControlCenterContext);

    useEffect(() => {
        const getPriceStatus = async () =>{
            if (library && account && chainId) {      
                const service = new TokenService(token, library, account!)      
                setLoading(true)           
                setPriceStatus(await service.getPrices())
                setLoading(false)
            }
        }
        getPriceStatus()
        const timer = setInterval(() => getPriceStatus(), 10000)
        return () => clearInterval(timer)    
    }, [library, account, chainId, token])

    useEffect(() => {

    })

    return (
    <Wrapper>
        {token !== Token.upTether && <div>{loading ? <BalanceLoader/> : priceStatus ? `${priceStatus.basePool} ${baseTicker}` : null}</div> }
        <div>{loading ? <BalanceLoader/> : priceStatus ? `${priceStatus.elitePool} ${eliteTicker}` : null}</div>
    </Wrapper>)
}