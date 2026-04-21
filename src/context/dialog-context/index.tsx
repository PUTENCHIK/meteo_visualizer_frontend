import React, { createContext, useContext, useState, useCallback } from 'react';
import type { DialogPayloads } from './payloads';

export type DialogId = keyof DialogPayloads;

export interface DialogItem<K extends DialogId = DialogId> {
    id: K;
    data?: DialogPayloads[K];
}

interface DialogContextType {
    activeDialogs: DialogItem[];
    openDialog: <K extends DialogId>(
        id: K,
        ...args: undefined extends DialogPayloads[K]
            ? [data?: DialogPayloads[K]]
            : [data: DialogPayloads[K]]
    ) => void;
    closeDialog: (amount?: number) => void;
    closeAllDialogs: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeDialogs, setActiveDialogs] = useState<DialogItem[]>([]);

    const openDialog = useCallback(<K extends DialogId>(id: K, data?: any) => {
        setActiveDialogs((prev) => [...prev, { id, data }]);
    }, []);

    const closeDialog = useCallback((amount?: number) => {
        setActiveDialogs((prev) => prev.slice(0, -(amount ?? 1)));
    }, []);

    const closeAllDialogs = useCallback(() => {
        setActiveDialogs([]);
    }, []);

    return (
        <DialogContext.Provider
            value={{
                activeDialogs: activeDialogs,
                openDialog,
                closeDialog,
                closeAllDialogs,
            }}>
            {children}
        </DialogContext.Provider>
    );
};

export const useDialogs = () => {
    const context = useContext(DialogContext);
    if (!context) throw new Error('useDialogs must be used within DialogProvider');
    return context;
};
