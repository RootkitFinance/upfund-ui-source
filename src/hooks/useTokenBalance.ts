import { useCallback, useContext, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import useBlock from './useBlock'
import { useWeb3React } from '@web3-react/core'
import { TokenService } from '../services/TokenService'
import { ControlCenterContext } from '../contexts/ControlCenterContext'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, library, chainId } = useWeb3React() 
  const { token } = useContext(ControlCenterContext);
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const service = new TokenService(token, library, account!)
    const balance = await service.getBalance(account!, tokenAddress)
    setBalance(new BigNumber(balance.toString()))
   
  }, [account, chainId, tokenAddress, library])

  useEffect(() => {
    if (account && library) {
      fetchBalance()
    }
  }, [account, chainId, library, fetchBalance, setBalance, block, tokenAddress])
  return balance
}

export default useTokenBalance

