import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { baseAddresses, basePoolAddresses, baseTickers, eliteAddresses, elitePoolAddresses, eliteTickers, rootedAddresses, rootedTickers, Token } from '../constants';

export interface IControlCenterContextInterface {
    token: Token
    baseTicker: string
    eliteTicker: string
    rootedTicker: string
    baseAddress: string
    eliteAddress: string
    rootedAddress: string
    basePoolAddress: string
    elitePoolAddress: string
    setToken: (token: Token) => void
}

const ControlCenterContext = createContext<IControlCenterContextInterface>({
    token: Token.ROOT,
    baseTicker: baseTickers.get(Token.ROOT)!,
    eliteTicker: eliteTickers.get(Token.ROOT)!,
    rootedTicker: rootedTickers.get(Token.ROOT)!,
    baseAddress: baseAddresses.get(Token.ROOT)!,
    eliteAddress: eliteAddresses.get(Token.ROOT)!,
    rootedAddress: rootedAddresses.get(Token.ROOT)!,
    basePoolAddress: basePoolAddresses.get(Token.ROOT)!,
    elitePoolAddress: elitePoolAddresses.get(Token.ROOT)!,
    setToken: (token: Token) => {}
});

const ControlCenterProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<Token>(Token.ROOT);   
    const [baseTicker, setBaseTicker] = useState<string>(baseTickers.get(Token.ROOT)!);
    const [eliteTicker, setEliteTicker] = useState<string>(eliteTickers.get(Token.ROOT)!);
    const [rootedTicker, setRootedTicker] = useState<string>(rootedTickers.get(Token.ROOT)!);
    const [baseAddress, setBaseAddress] = useState<string>(baseAddresses.get(Token.ROOT)!);
    const [eliteAddress, setEliteAddress] = useState<string>(eliteAddresses.get(Token.ROOT)!);
    const [rootedAddress, setRootedAddress] = useState<string>(rootedAddresses.get(Token.ROOT)!);
    const [basePoolAddress, setBasePoolAddress] = useState<string>(basePoolAddresses.get(Token.ROOT)!);
    const [elitePoolAddress, setElitePoolAddress] = useState<string>(elitePoolAddresses.get(Token.ROOT)!);

    useEffect(() => {
        setBaseTicker(baseTickers.get(token)!);
        setEliteTicker(eliteTickers.get(token)!);
        setRootedTicker(rootedTickers.get(token)!);
        setBaseAddress(baseAddresses.get(token)!);
        setEliteAddress(eliteAddresses.get(token)!);
        setRootedAddress(rootedAddresses.get(token)!);
        setBasePoolAddress(basePoolAddresses.get(token)!);
        setElitePoolAddress(elitePoolAddresses.get(token)!);
        
    }, [token])

    return (
        <ControlCenterContext.Provider value={{
            token: token, 
            baseTicker: baseTicker, 
            eliteTicker: eliteTicker, 
            rootedTicker: rootedTicker, 
            baseAddress: baseAddress,
            eliteAddress: eliteAddress,
            rootedAddress: rootedAddress,
            basePoolAddress: basePoolAddress,
            elitePoolAddress: elitePoolAddress,
            setToken: setToken}}>
          {children}
        </ControlCenterContext.Provider>
    )
}
  
export { ControlCenterContext, ControlCenterProvider }; 