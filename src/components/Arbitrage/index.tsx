import { useWeb3React } from "@web3-react/core";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Token } from "../../constants";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { ResultType } from "../../dtos/ArbitrageResultInfo";
import { ArbitrageService } from "../../services/ArbitrageService";
import { supportedChain } from "../../utils";
import { ButtonPrimaryGreen, ButtonPrimaryRed } from "../Button";

const Wrapper = styled.div`
    display: grid;
    padding: 1em;
`

const Arbitrage = () => {
    const [active, setActive] = useState<boolean>(false);
    const oneMinute = 60000;
    const [arbitrageInterval, setArbitrageInterval] = useState<number>(oneMinute);

    const { account, library, chainId } = useWeb3React()
    const { token } = useContext(ControlCenterContext);

    useEffect(() => {
        const performArbitrage = async () =>{
            if (library && account && active && supportedChain(chainId!, token)) {      
                const service = new ArbitrageService(library, account!, token)      
                const result = await service.performArbitrage();
                if (result.message) {
                    console.log(result.message);
                }
               
                if (result.type === ResultType.None){
                    setArbitrageInterval(oneMinute);
                }
                else if (result.type === ResultType.Success) {
                    setArbitrageInterval(oneMinute * 10);
                }
                else if (result.type === ResultType.Error) {
                    setArbitrageInterval(oneMinute * 60);
                }

            }
        }
        performArbitrage()
        const timer = setInterval(() => performArbitrage(), arbitrageInterval)
        return () => clearInterval(timer)    
    }, [library, account, chainId, token, active])

    return (
    <Wrapper>
        {active 
        ? <ButtonPrimaryRed disabled={token === Token.upTether || !supportedChain(chainId!, token)} onClick={() => setActive(false)}>STOP</ButtonPrimaryRed> 
        : <ButtonPrimaryGreen disabled={token === Token.upTether  || !supportedChain(chainId!, token)} onClick={() => setActive(true)}>START</ButtonPrimaryGreen>}
    </Wrapper>

    )
}

export default Arbitrage