import React, { createContext, useContext, useState, useCallback } from 'react';

export type DialogId = 'complexData' | 'websocketApi' | 'masts' | 'weatherStations';

interface DialogContextType {
    activeDialogs: DialogId[];
    openDialog: (id: DialogId) => void;
    closeDialog: (id: DialogId) => void;
    toggleDialog: (id: DialogId) => void;
    focusDialog: (id: DialogId) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeDialogs, setActiveDialogs] = useState<DialogId[]>([]);

    const openDialog = useCallback((id: DialogId) => {
        setActiveDialogs((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }, []);

    const closeDialog = useCallback((id: DialogId) => {
        setActiveDialogs((prev) => prev.filter((d) => d !== id));
    }, []);

    const toggleDialog = useCallback((id: DialogId) => {
        setActiveDialogs((prev) =>
            prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
        );
    }, []);

    const focusDialog = useCallback((id: DialogId) => {
        setActiveDialogs((prev) => {
            if (prev[prev.length - 1] === id) return prev;
            return [...prev.filter((d) => d !== id), id];
        });
    }, []);

    return (
        <DialogContext.Provider
            value={{ activeDialogs, openDialog, closeDialog, toggleDialog, focusDialog }}>
            {children}
        </DialogContext.Provider>
    );
};

export const useDialogs = () => {
    const context = useContext(DialogContext);
    if (!context) throw new Error('useDialogs must be used within DialogProvider');
    return context;
};
