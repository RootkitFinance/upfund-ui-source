import { useWeb3React } from "@web3-react/core";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Token } from "../../constants";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { ArbitrageService } from "../../services/ArbitrageService";
import { supportedChain } from "../../utils";
import { ButtonPrimaryGreen, ButtonPrimaryRed } from "../Button";

const Wrapper = styled.div`
    display: grid;
    padding: 1em;
`

const Arbitrage = () => {
    const [active, setActive] = useState<boolean>(false);

    const { account, library, chainId } = useWeb3React()
    const { token } = useContext(ControlCenterContext);

    useEffect(() => {
        const performArbitrage = async () =>{
            if (library && account && chainId && active && false) {      
                const service = new ArbitrageService(library, account!, token)      
                await service.performArbitrage();
            }
        }
        performArbitrage()
        const timer = setInterval(() => performArbitrage(), 60000)
        return () => clearInterval(timer)    
    }, [library, account, chainId, token])

    return (
    <Wrapper>
        {active 
        ? <ButtonPrimaryRed disabled={token === Token.upTether || !supportedChain(chainId!, token)} onClick={() => setActive(false)}>STOP</ButtonPrimaryRed> 
        : <ButtonPrimaryGreen disabled={token === Token.upTether  || !supportedChain(chainId!, token)} onClick={() => setActive(true)}>START</ButtonPrimaryGreen>}
    </Wrapper>

    )
}

export default Arbitrage