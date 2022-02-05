import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Web3Status from "../Web3Status";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { YellowCard } from "../Card";
import { RowFixed } from "../Row";
import { Option } from "../Button";
import { NETWORK_LABELS, SUPPORTED_NETWORKS, Token, tokenChains } from "../../constants";
import PriceStatus from "../PriceStatus";
import { ControlCenterContext } from "../../contexts/ControlCenterContext";
import { supportedChain } from "../../utils";

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  width: 100%;
  border-radius: 1em;
  border: 1px solid ${({ theme }) => theme.text5};
  padding: 0.5em 0.5em 0.5em 1em;
  background-color: ${({ theme }) => theme.bg1};
`;

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`;

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderRow = styled(RowFixed)`
  width: fit-content;
`;

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) =>
      !active ? theme.bg2 : theme.bg4};
  } */
`;

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 4px 12px;
  width: auto;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`;

const TitleText = styled.div`
  font-size: 1.5em;
  white-space: nowrap;
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;
const LogoWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1em;
  align-items: center;
  padding-right: 2em;
`;

const LinksWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1em;
  align-items: center;
  padding-right: 2em;
  justify-self: start;
`;

export default function Header() {
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const { token } = useContext(ControlCenterContext);
  const suppotedChain = chainId && supportedChain(chainId!, token);
  const [selectedToken, setSelectedToken] = useState<Token>(token);
  const [selectedTokenChain, setSelectedTokenChain] = useState<number>(chainId ?? 1);

  const { setToken } = useContext(ControlCenterContext);

  useEffect(() => {
    setToken(selectedToken);
    setSelectedTokenChain(tokenChains.get(selectedToken)!);
  },
  [selectedToken])

  useEffect(() => {
    switchChain();
  },
  [selectedTokenChain])


  const switchChain = () => { 
    const params = SUPPORTED_NETWORKS[selectedTokenChain]!;
    if (selectedTokenChain === 1) {
      library?.send('wallet_switchEthereumChain', [{ chainId: params.chainId }, account])
    } else {
      library?.send('wallet_addEthereumChain', [params, account]).catch((error: any) => {console.log(error)})
    }
  }  

  return (
    <HeaderFrame>
      <HeaderRow>
        <LogoWrapper>
          <TitleText>Control Center</TitleText>
        </LogoWrapper>
      </HeaderRow>
      <LinksWrapper>
        <Option active={selectedToken === Token.ROOT} onClick={() => setSelectedToken(Token.ROOT)}>ROOT</Option>
        <Option active={selectedToken === Token.upTether} onClick={() => setSelectedToken(Token.upTether)}>upTether</Option>
        <Option active={selectedToken === Token.upBNB} onClick={() => setSelectedToken(Token.upBNB)}>upBNB</Option>
        <Option active={selectedToken === Token.upMatic} onClick={() => setSelectedToken(Token.upMatic)}>upMatic</Option>
        <Option active={selectedToken === Token.upCake} onClick={() => setSelectedToken(Token.upCake)}>upCake</Option>
        <Option active={selectedToken === Token.upCro} onClick={() => setSelectedToken(Token.upCro)}>upCro</Option>
      </LinksWrapper>
      <HeaderControls>
        {suppotedChain && <PriceStatus />}
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>
                {NETWORK_LABELS[chainId]}
              </NetworkCard>
            )}
          </HideSmall>
          <AccountElement active={!!account} style={{ pointerEvents: "auto" }}>
            <Web3Status />
          </AccountElement>
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  );
}
