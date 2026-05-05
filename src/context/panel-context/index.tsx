import React, { createContext, useContext, useState, useCallback } from 'react';
import type { PanelPayloads } from './payloads';

export type PanelId = keyof PanelPayloads;

export interface PanelItem<K extends PanelId = PanelId> {
    id: K;
    data?: PanelPayloads[K];
}

interface PanelContextType {
    activePanels: PanelItem[];
    panelsOrder: PanelId[];
    openPanel: <K extends PanelId>(
        id: K,
        ...args: undefined extends PanelPayloads[K]
            ? [data?: PanelPayloads[K]]
            : [data: PanelPayloads[K]]
    ) => void;
    closePanel: (id: PanelId) => void;
    closeAllPanels: () => void;
    focusPanel: (id: PanelId) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelProvider = ({ children }: { children: React.ReactNode }) => {
    const [activePanels, setActivePanels] = useState<PanelItem[]>([]);
    const [panelsOrder, setPanelsOrder] = useState<PanelId[]>([]);

    const openPanel = useCallback(<K extends PanelId>(id: K, data?: any) => {
        setActivePanels((prev) => (prev.find((p) => p.id === id) ? prev : [...prev, { id, data }]));
        setPanelsOrder((prev) => (prev.find((p) => p === id) ? prev : [...prev, id]));
    }, []);

    const closePanel = useCallback((id: PanelId) => {
        setActivePanels((prev) => prev.filter((p) => p.id !== id));
        setPanelsOrder((prev) => prev.filter((p) => p !== id));
    }, []);

    const closeAllPanels = useCallback(() => {
        setActivePanels([]);
        setPanelsOrder([]);
    }, []);

    const focusPanel = useCallback((id: PanelId) => {
        setPanelsOrder((prev) => [...prev.filter((p) => p !== id), id]);
    }, []);

    return (
        <PanelContext.Provider
            value={{
                activePanels,
                panelsOrder,
                openPanel,
                closePanel,
                closeAllPanels,
                focusPanel,
            }}>
            {children}
        </PanelContext.Provider>
    );
};

export const usePanels = () => {
    const context = useContext(PanelContext);
    if (!context) throw new Error('usePanels must be used within PanelProvider');
    return context;
};
