import React, { createContext, useContext, useState, useCallback } from 'react';

export type PanelId = 'complexData' | 'websocketApi' | 'masts' | 'weatherStations' | 'charts';

interface PanelContextType {
    activePanels: PanelId[];
    openPanel: (id: PanelId) => void;
    closePanel: (id: PanelId) => void;
    togglePanel: (id: PanelId) => void;
    focusPanel: (id: PanelId) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelProvider = ({ children }: { children: React.ReactNode }) => {
    const [activePanels, setActivePanels] = useState<PanelId[]>([]);

    const openPanel = useCallback((id: PanelId) => {
        setActivePanels((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }, []);

    const closePanel = useCallback((id: PanelId) => {
        setActivePanels((prev) => prev.filter((d) => d !== id));
    }, []);

    const togglePanel = useCallback((id: PanelId) => {
        setActivePanels((prev) =>
            prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
        );
    }, []);

    const focusPanel = useCallback((id: PanelId) => {
        setActivePanels((prev) => {
            if (prev[prev.length - 1] === id) return prev;
            return [...prev.filter((d) => d !== id), id];
        });
    }, []);

    return (
        <PanelContext.Provider
            value={{
                activePanels,
                openPanel,
                closePanel,
                togglePanel,
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
