import { storageManager } from '@managers/local-storage-manager';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark';

const FONT_SIZES = [14, 16, 18, 20] as const;

export type FontSize = (typeof FONT_SIZES)[number];

export const DEFAULT_THEME: Theme = 'dark';

export const DEFAULT_FONT_SIZE: FontSize = 16;

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    fontSize: FontSize;
    fontSizeLabels: Record<FontSize, string>;
    changeFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(
        (storageManager.getItem('theme') as Theme) || DEFAULT_THEME,
    );
    const [fontSize, setFontSize] = useState<FontSize>(
        storageManager.getItem('fonsSize') || DEFAULT_FONT_SIZE,
    );

    const fontSizeLabels = useMemo(() => {
        const result = {} as Record<FontSize, string>;

        for (const value of FONT_SIZES) {
            result[value] = `${value}px`;
        }

        return result;
    }, [FONT_SIZES]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        storageManager.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.style.setProperty('--font-regular', `${fontSize}px`);
        storageManager.setItem('fonsSize', fontSize);
    }, [fontSize]);

    return (
        <ThemeContext.Provider
            value={{ theme, toggleTheme, fontSize, fontSizeLabels, changeFontSize: setFontSize }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
