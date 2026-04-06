import type { CameraControls } from '@react-three/drei';
import type { Camera } from '@react-three/fiber';
import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
    type ReactNode,
    type RefObject,
} from 'react';
import { Vector3, type Scene } from 'three';

interface SceneContextType {
    sceneRef: RefObject<Scene | null>;
    cameraRef: RefObject<Camera | null>;
    controlsRef: RefObject<CameraControls | null>;
    getMeshPosition: (id: string) => Vector3 | undefined;
    fps: number;
    updateFps: (value: number) => void;
}

const SceneContext = createContext<SceneContextType | undefined>(undefined);

export const SceneProvider = ({ children }: { children: ReactNode }) => {
    const sceneRef = useRef<Scene>(null);
    const controlsRef = useRef<CameraControls>(null);
    const cameraRef = useRef<Camera>(null);
    const [fps, setFps] = useState<number>(0);

    const getMeshPosition = useCallback((id: string) => {
        if (!sceneRef.current || !id) return undefined;
        const target = sceneRef.current.getObjectByName(id);
        return target?.getWorldPosition(new Vector3());
    }, []);

    const contextValue: SceneContextType = {
        sceneRef: sceneRef,
        controlsRef: controlsRef,
        cameraRef: cameraRef,
        getMeshPosition: getMeshPosition,
        fps: fps,
        updateFps: setFps,
    };

    return <SceneContext.Provider value={contextValue}>{children}</SceneContext.Provider>;
};

export const useScene = () => {
    const context = useContext(SceneContext);
    if (!context) throw new Error('useScene must be used within SceneProvider');
    return context;
};
