import { createContext, useContext } from 'react';
import { useContextBridge, type ContextBridge } from 'its-fine';

interface BridgeContextType {
    Bridge: ContextBridge;
}

const BridgeContext = createContext<BridgeContextType | undefined>(undefined);

export const BridgeProvider = ({ children }: { children: React.ReactNode }) => {
    const Bridge = useContextBridge();

    const contextValue: BridgeContextType = {
        Bridge: Bridge,
    };

    return <BridgeContext.Provider value={contextValue}>{children}</BridgeContext.Provider>;
};

export const useBridge = () => {
    const context = useContext(BridgeContext);
    if (!context) throw new Error('useBridge must be used within BridgeProvider');
    return context;
};
