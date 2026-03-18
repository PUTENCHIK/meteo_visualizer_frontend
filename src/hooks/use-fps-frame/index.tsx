import { useRef } from 'react';
import { useFrame, type RootState } from '@react-three/fiber';

export const useFpsFrame = (
    callback: (state: RootState, delta: number) => void,
    fps: number = 60,
) => {
    const interval = 1 / fps;
    const timer = useRef(0);

    useFrame((state, delta) => {
        timer.current += delta;

        if (timer.current >= interval) {
            callback(state, timer.current);
            timer.current %= interval;
        }
    });
};
