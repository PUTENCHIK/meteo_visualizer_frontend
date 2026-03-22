import { storageManager } from '@managers/local-storage-manager';
import { type GeographicSystemPosition } from '@utils/coordinate-systems';
import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from 'react';
import { Vector3 } from 'three';

interface ComplexDataContextType {
    position: GeographicSystemPosition;
    updatePosition: (lat: Vector3, lon: Vector3) => void;
}

const ComplexDataContext = createContext<ComplexDataContextType | undefined>(undefined);

export const ComplexDataProvider = ({ children }: { children: ReactNode }) => {

    const [position, setPosition] = useState<GeographicSystemPosition>(
        storageManager.getItem('position'),
    );

    const updatePosition = useCallback((lat: Vector3, lon: Vector3) => {
        const newPos: GeographicSystemPosition = { lat, lon };
        setPosition(newPos);
        storageManager.setItem('position', newPos);
    }, []);

    const contextValue: ComplexDataContextType = {
        position: position,
        updatePosition: updatePosition,
    };

    return (
        <ComplexDataContext.Provider value={contextValue}>{children}</ComplexDataContext.Provider>
    );
};

export const useComplexData = () => {
    const context = useContext(ComplexDataContext);
    if (!context) throw new Error('useComplexData must be used within ComplexDataProvider');
    return context;
};
