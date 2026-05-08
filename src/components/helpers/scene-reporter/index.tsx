import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScene } from '@context/scene-context';

export const SceneReporter = () => {
    const { sceneRef, cameraRef, updateFps } = useScene();

    const { camera } = useThree();
    const { scene } = useThree();

    useEffect(() => {
        if (scene) sceneRef.current = scene;
        if (camera) cameraRef.current = camera;
    }, [scene, camera, sceneRef, cameraRef]);

    const frames = useRef<number>(0);
    const prevTime = useRef<number>(performance.now());

    useFrame(() => {
        const time = performance.now();
        frames.current++;

        if (time >= prevTime.current + 1000) {
            updateFps(Math.round((frames.current * 1000) / (time - prevTime.current)));
            prevTime.current = time;
            frames.current = 0;
        }
    });

    return null;
};
