import React, { useState, useContext } from "react"
import styled from "styled-components"
import { ButtonPrimary, ButtonPrimaryRed, ButtonPrimaryGreen } from "../Button"
import UnwrapElite from "./UnwrapElite"
import ZapEliteToBase from "./ZapEliteToBase"
import AddLiquidity from "./AddLiquidity"
import { Token } from "../../constants"
import RemoveLiquidity from "./RemoveLiquidity"
import BuyRooted from "./BuyRooted"
import SellRooted from "./SellRooted"
import WrapToElite from "./WrapToElite"
import ZapBaseToElite from "./ZapBaseToElite"
import SetInfinitePumper from "./SetSeniorVaultManager"
import RemoveBuyAndTax from "./RemoveBuyAndTax"
import RecoverTokens from "./RecoverTokens"
import BalancePrice from "./BalancePrice"
import SweepFloor from "./SweepFloor"
import BuyAndTax from "./BuyAndTax"
import { ControlCenterContext } from "../../contexts/ControlCenterContext"
import { supportedChain } from "../../utils"
import { useWeb3React } from "@web3-react/core"
import PayFees from "./PayFees"
import SetFees from "./SetFees"
import UpCroSweepFloor from "./UpCroSweepFloor"
import ReduceLockedLiquidity from "./ReduceLockedLiquidity"
import Swap from "./Swap"
import UsdSwap from "./UsdSwap"
import UpCroAddLiquidity from "./UpCroAddLiquidity"

const Wrapper = styled.div`
    display: grid;
    grid-gap: 1em;
    width: 100%;
    padding: 1em 0 0 0;
`

const SectionWrapper = styled.div`
:not(:last-child){
  border-bottom: 1px solid ${({ theme }) => theme.text5};  
  padding-bottom: 1em;
}
`

const SectionContent = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1em;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: repeat(3, 1fr);
  `};
`

const SectionHeader = styled.div`
  padding-left: 0.25em;
  padding-bottom: 1em;  
  color: ${({ theme }) => theme.text3};
`

const Vault = () => {
  const { token, baseTicker, eliteTicker, rootedTicker, baseAddress, eliteAddress, rootedAddress, basePoolAddress, elitePoolAddress } = useContext(ControlCenterContext);
  const { chainId } = useWeb3React()
  const [unwrapEliteOpen, setUnwrapEliteOpen] = useState<boolean>(false)
  const [wrapToEliteOpen, setWrapToEliteOpen] = useState<boolean>(false)
  const [zapEliteToBaseOpen, setZapEliteToBaseOpen] = useState<boolean>(false)
  const [zapBaseToEliteOpen, setZapBaseToEliteOpen] = useState<boolean>(false)
  const [addEliteLiquidityOpen, setAddEliteLiquidityOpen] = useState<boolean>(false)
  const [removeEliteLiquidityOpen, setRemoveEliteLiquidityOpen] = useState<boolean>(false)
  const [buyRootWithEliteOpen, setBuyRootWithEliteOpen] = useState<boolean>(false)
  const [sellRootForEliteOpen, setSellRootForEliteOpen] = useState<boolean>(false)
  const [upCroAddBaseLiquidityOpen, setUpCroAddBaseLiquidityOpen] = useState<boolean>(false)
  const [addBaseLiquidityOpen, setAddBaseLiquidityOpen] = useState<boolean>(false)
  const [removeBaseLiquidityOpen, setRemoveBaseLiquidityOpen] = useState<boolean>(false)
  const [buyRootWithBaseOpen, setBuyRootWithBaseOpen] = useState<boolean>(false)
  const [sellRootForBaseOpen, setSellRootForBaseOpen] = useState<boolean>(false)
  const [payFeesOpen, setPayFeesOpen] = useState<boolean>(false)
  const [setFeesOpen, setSetFeesOpen] = useState<boolean>(false)
 
  const [sweepFloorOpen, setSweepFloorOpen] = useState<boolean>(false)
  const [upCroSweepFloorOpen, setUpCroSweepFloorOpen] = useState<boolean>(false)
  const [upCroUnsweepFloorOpen, setUpCroUnsweepFloorOpen] = useState<boolean>(false)
  const [reduceLockedLiquidityOpen, setReduceLockedLiquidityOpen] = useState<boolean>(false)

  const [balancePriceBaseOpen, setBalancePriceBaseOpen] = useState<boolean>(false)
  const [balancePriceEliteOpen, setBalancePriceEliteOpen] = useState<boolean>(false)
  const [liquidityControllerOpen, setLiquidityControllerOpen] = useState<boolean>(false)
  const [removeBuyAndTaxBaseOpen, setRemoveBuyAndTaxBaseOpen] = useState<boolean>(false)
  const [removeBuyAndTaxEliteOpen, setRemoveBuyAndTaxEliteOpen] = useState<boolean>(false)
  const [buyAndTaxBaseOpen, setBuyAndTaxBaseOpen] = useState<boolean>(false)
  const [buyAndTaxEliteOpen, setBuyAndTaxEliteOpen] = useState<boolean>(false)
  const [recoverTokensOpen, setRecoverTokenOpen] = useState<boolean>(false)
  const [recoverTokensAddress, setRecoverTokensAddress] = useState<string>(baseAddress)

  const [empireSwapOpen, setEmpireSwapOpen] = useState<boolean>(false)
  const [vvsSwapOpen, setVvsSwapOpen] = useState<boolean>(false)
  const [croUsdSwapOpen, setCroUsdSwapOpen] = useState<boolean>(false)
  const [usdCroSwapOpen, setUsdCroSwapOpen] = useState<boolean>(false)

  const recoverTokens = (address: string) => {
    setRecoverTokensAddress(address)
    setRecoverTokenOpen(true)
  }

  return (
    <Wrapper>
      <UnwrapElite isOpen={unwrapEliteOpen} onDismiss={() => setUnwrapEliteOpen(false)} />
      <ZapEliteToBase isOpen={zapEliteToBaseOpen} onDismiss={() => setZapEliteToBaseOpen(false)} />
      <WrapToElite isOpen={wrapToEliteOpen} onDismiss={() => setWrapToEliteOpen(false)} />
      <ZapBaseToElite isOpen={zapBaseToEliteOpen} onDismiss={() => setZapBaseToEliteOpen(false)} />
      <AddLiquidity tokenAddress={eliteAddress} isOpen={addEliteLiquidityOpen} onDismiss={() => setAddEliteLiquidityOpen(false)} />
      <RemoveLiquidity tokenAddress={eliteAddress} lpAddress={elitePoolAddress} isOpen={removeEliteLiquidityOpen} onDismiss={() => setRemoveEliteLiquidityOpen(false)} />
      <BuyRooted tokenAddress={eliteAddress} isOpen={buyRootWithEliteOpen} onDismiss={() => setBuyRootWithEliteOpen(false)} />
      <SellRooted tokenAddress={eliteAddress} isOpen={sellRootForEliteOpen} onDismiss={() => setSellRootForEliteOpen(false)} />
      <AddLiquidity tokenAddress={baseAddress} isOpen={addBaseLiquidityOpen} onDismiss={() => setAddBaseLiquidityOpen(false)} />
      <UpCroAddLiquidity isOpen={upCroAddBaseLiquidityOpen} onDismiss={() => setUpCroAddBaseLiquidityOpen(false)}/>
      <RemoveLiquidity tokenAddress={baseAddress} lpAddress={basePoolAddress} isOpen={removeBaseLiquidityOpen} onDismiss={() => setRemoveBaseLiquidityOpen(false)} />
      <BuyRooted tokenAddress={baseAddress} isOpen={buyRootWithBaseOpen} onDismiss={() => setBuyRootWithBaseOpen(false)} />
      <SellRooted tokenAddress={baseAddress} isOpen={sellRootForBaseOpen} onDismiss={() => setSellRootForBaseOpen(false)} />
      <PayFees isOpen={payFeesOpen} onDismiss={() => setPayFeesOpen(false)}/>
      <SetFees isOpen={setFeesOpen} onDismiss={() => setSetFeesOpen(false)}/>
   
      <SweepFloor isOpen={sweepFloorOpen} onDismiss={() => setSweepFloorOpen(false)}/>
      <UpCroSweepFloor sweep={true} isOpen={upCroSweepFloorOpen} onDismiss={() => setUpCroSweepFloorOpen(false)} />
      <UpCroSweepFloor sweep={false} isOpen={upCroUnsweepFloorOpen} onDismiss={() => setUpCroUnsweepFloorOpen(false)} />
      <ReduceLockedLiquidity isOpen={reduceLockedLiquidityOpen} onDismiss={() => setReduceLockedLiquidityOpen(false)} />
      <SetInfinitePumper isOpen={liquidityControllerOpen} onDismiss={() => setLiquidityControllerOpen(false)} />
      <RemoveBuyAndTax tokenAddress={baseAddress} lpAddress={basePoolAddress} isOpen={removeBuyAndTaxBaseOpen} onDismiss={() => setRemoveBuyAndTaxBaseOpen(false)} />
      <RemoveBuyAndTax tokenAddress={eliteAddress} lpAddress={elitePoolAddress} isOpen={removeBuyAndTaxEliteOpen} onDismiss={() => setRemoveBuyAndTaxEliteOpen(false)} />
      <BuyAndTax tokenAddress={baseAddress} isOpen={buyAndTaxBaseOpen} onDismiss={() => setBuyAndTaxBaseOpen(false)} />
      <BuyAndTax tokenAddress={eliteAddress} isOpen={buyAndTaxEliteOpen} onDismiss={() => setBuyAndTaxEliteOpen(false)} />
      <BalancePrice elite={false} isOpen={balancePriceBaseOpen} onDismiss={() => setBalancePriceBaseOpen(false)} />
      <BalancePrice elite={true} isOpen={balancePriceEliteOpen} onDismiss={() => setBalancePriceEliteOpen(false)} />
      <RecoverTokens tokenAddress={recoverTokensAddress} isOpen={recoverTokensOpen} onDismiss={() => setRecoverTokenOpen(false)} />

      <Swap empire={true} isOpen={empireSwapOpen} onDismiss={() => setEmpireSwapOpen(false)} />
      <Swap empire={false} isOpen={vvsSwapOpen} onDismiss={() => setVvsSwapOpen(false)} />
      <UsdSwap croUsd={true} isOpen={croUsdSwapOpen} onDismiss={() => setCroUsdSwapOpen(false)} />
      <UsdSwap croUsd={false} isOpen={usdCroSwapOpen} onDismiss={() => setUsdCroSwapOpen(false)} />

      <SectionWrapper>
        <SectionContent>          
          <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setLiquidityControllerOpen(true)}>Set Senior Vault Manager</ButtonPrimary>
          <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => token === Token.upCro ? setUpCroSweepFloorOpen(true) : setSweepFloorOpen(true)}>Sweep Floor</ButtonPrimary>
          {token === Token.upCro && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setUpCroUnsweepFloorOpen(true)}>Unsweep Floor</ButtonPrimary>}
          {token === Token.upCro && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setReduceLockedLiquidityOpen(true)}>Reduce Locked Liquidity</ButtonPrimary>}
        </SectionContent>
      </SectionWrapper>

      {token === Token.upCro && 
      <SectionWrapper>       
        <SectionHeader>Swaps</SectionHeader>
        <SectionContent>
          <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setEmpireSwapOpen(true)}>Empire Swap</ButtonPrimary>
          <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setVvsSwapOpen(true)}>VVS Swap</ButtonPrimary>          
          <ButtonPrimaryGreen disabled={!supportedChain(chainId!, token)} onClick={() => setCroUsdSwapOpen(true)}>CRO-USD Swap</ButtonPrimaryGreen>
          <ButtonPrimaryGreen disabled={!supportedChain(chainId!, token)} onClick={() => setUsdCroSwapOpen(true)}>USD-CRO Swap</ButtonPrimaryGreen>
        </SectionContent>
      </SectionWrapper>}

      {token !== Token.upCro && 
      <SectionWrapper>       
        <SectionHeader>Elite ({eliteTicker})</SectionHeader>
        <SectionContent>
          <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setRemoveBuyAndTaxEliteOpen(true)}>Remove, Buy and Tax Elite</ButtonPrimary>
          <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setBuyAndTaxEliteOpen(true)}>Buy and Tax Elite</ButtonPrimary>
          {token !== Token.upTether && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setBalancePriceEliteOpen(true)}>Balance Price Elite</ButtonPrimary>}
          <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setUnwrapEliteOpen(true)}>Unwrap Elite</ButtonPrimary>
          {token !== Token.upTether &&<ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setZapEliteToBaseOpen(true)}>Zap Elite to Base</ButtonPrimary>}
          <ButtonPrimaryGreen disabled={!supportedChain(chainId!, token)} onClick={() => setAddEliteLiquidityOpen(true)}>Add Elite Liquidity</ButtonPrimaryGreen>
          <ButtonPrimaryRed disabled={!supportedChain(chainId!, token)} onClick={() => setRemoveEliteLiquidityOpen(true)}>Remove Elite Liquidity</ButtonPrimaryRed>
          <ButtonPrimaryGreen disabled={!supportedChain(chainId!, token)} onClick={() => setBuyRootWithEliteOpen(true)}>Buy Rooted with Elite</ButtonPrimaryGreen>
          <ButtonPrimaryRed disabled={!supportedChain(chainId!, token)} onClick={() => setSellRootForEliteOpen(true)}>Sell Rooted for Elite</ButtonPrimaryRed>
        </SectionContent>
      </SectionWrapper>}     

     
      <SectionWrapper>
        <SectionHeader>Base ({baseTicker})</SectionHeader>
        <SectionContent>
          {token !== Token.upTether && token !== Token.upCro && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setRemoveBuyAndTaxBaseOpen(true)}>Remove, Buy and Tax Base</ButtonPrimary>}
          {token !== Token.upTether && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setBuyAndTaxBaseOpen(true)}>Buy and Tax Base</ButtonPrimary>}
          {token !== Token.upTether && token !== Token.upCro && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setBalancePriceBaseOpen(true)}>Balance Price Base</ButtonPrimary>}
          {token !== Token.upCro && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setWrapToEliteOpen(true)}>Wrap to Elite</ButtonPrimary>}
          {token !== Token.upTether && token !== Token.upCro && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setZapBaseToEliteOpen(true)}>Zap Base to Elite</ButtonPrimary>}
          {token !== Token.upTether && <ButtonPrimaryGreen disabled={!supportedChain(chainId!, token)} onClick={() => token === Token.upCro ? setUpCroAddBaseLiquidityOpen(true) : setAddBaseLiquidityOpen(true)}>Add Base Liquidity</ButtonPrimaryGreen>}
          {token !== Token.upTether && <ButtonPrimaryRed disabled={!supportedChain(chainId!, token)} onClick={() => setRemoveBaseLiquidityOpen(true)}>Remove Base Liquidity</ButtonPrimaryRed>}
          {token !== Token.upTether && <ButtonPrimaryGreen disabled={!supportedChain(chainId!, token)} onClick={() => setBuyRootWithBaseOpen(true)}>Buy Rooted with Base</ButtonPrimaryGreen>}
          {token !== Token.upTether && <ButtonPrimaryRed disabled={!supportedChain(chainId!, token)} onClick={() => setSellRootForBaseOpen(true)}>Sell Rooted for Base</ButtonPrimaryRed>}
        </SectionContent>
      </SectionWrapper>

     {token !== Token.ROOT  &&  
      <SectionWrapper>
        <SectionHeader>Fee Splitter</SectionHeader>
        <SectionContent>
          <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setPayFeesOpen(true)}>Pay Fees</ButtonPrimary>
          <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => setSetFeesOpen(true)}>Set Fees</ButtonPrimary>
        </SectionContent>
      </SectionWrapper>}
     
      
      <SectionWrapper>
        <SectionHeader>Recover</SectionHeader>
        <SectionContent>
          <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => recoverTokens(baseAddress)}>{baseTicker}</ButtonPrimary>
          {token !== Token.upCro && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => recoverTokens(eliteAddress)}>{eliteTicker}</ButtonPrimary>}
          <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => recoverTokens(rootedAddress)}>{rootedTicker}</ButtonPrimary>
          {token !== Token.upTether && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => recoverTokens(basePoolAddress)}>{baseTicker} LP</ButtonPrimary> }
          {token !== Token.upCro && <ButtonPrimary disabled={!supportedChain(chainId!, token)} onClick={() => recoverTokens(elitePoolAddress)}>{eliteTicker} LP</ButtonPrimary>}
        </SectionContent>
      </SectionWrapper>
    </Wrapper>)
}

export default Vault;