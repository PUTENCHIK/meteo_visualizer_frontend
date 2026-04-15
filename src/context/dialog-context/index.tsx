import React, { createContext, useContext, useState, useCallback } from 'react';

export type DialogId = 'profile';

interface DialogContextType {
    activeDialog: DialogId | null;
    openDialog: (id: DialogId) => void;
    closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeDialog, setActiveDialog] = useState<DialogId | null>(null);

    const closeDialog = useCallback(() => {
        setActiveDialog(null);
    }, []);

    return (
        <DialogContext.Provider
            value={{
                activeDialog,
                openDialog: setActiveDialog,
                closeDialog,
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
