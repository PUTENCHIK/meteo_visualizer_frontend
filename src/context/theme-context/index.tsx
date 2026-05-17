import { useAppSettings } from '@hooks/use-app-settings';
import { createContext, useContext, useEffect } from 'react';

export type AppTheme = 'light' | 'dark';

interface ThemeContextType {}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { map: settings } = useAppSettings();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.common.theme);
    }, [settings.common.theme]);

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--font-regular',
            `${settings.common.fontSize}px`,
        );
    }, [settings.common.fontSize]);

    return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
