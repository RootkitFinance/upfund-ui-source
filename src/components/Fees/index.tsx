import { useWeb3React } from "@web3-react/core";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { TransferGateService } from "../../services/TransferGateService";
import { supportedChain } from "../../utils";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
    grid-gap: 0.5em;
    width: 100%;
    padding: 1em 0;
    color: ${({ theme }) => theme.text3};
    font-size: 0.875em;
` 

const FeesColumn = styled.span`
    text-align: right;
`

const Fees = () => {
    const { account, library, chainId } = useWeb3React()
    const { token } = useContext(ControlCenterContext);
    const [buyFees, setBuyFees] = useState<number>();
    const [sellFees, setSellFees] = useState<number>();

    useEffect(() => {        
        const getFees = async () => {
            const service = new TransferGateService(token, library, account!);
            setBuyFees(await service.getBuyFees());
            setSellFees(await service.getSellFees());
        }
        if (account && supportedChain(chainId!, token)){
            getFees();
        }
       
    }, [token, chainId])
    return (
        <Wrapper>
          <span>Buy Fees</span>
          <FeesColumn>{buyFees}</FeesColumn>
          <span>%</span>
          <span>Sell Fees</span>
          <FeesColumn>{sellFees}</FeesColumn>
          <span>%</span>
        </Wrapper>
    )
}

export default Fees;