import clsx from 'clsx';
import s from './compass-model.module.scss';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import { BoxMesh } from '@models_/box-mesh';
import { Euler, Group, Vector3 } from 'three';
import { MeshGroup } from '@models_/mesh-group';
import { Loader } from '@components/loader';
import { TextMesh } from '@models_/text-mesh';
import { useSettings } from '@context/use-settings';
import { useScene } from '@context/scene-context';
import { useFpsFrame } from '@hooks/use-fps-frame';
import { useTheme } from '@context/theme-context';

export type CompassType = '2D' | '3D';

const Compass = () => {
    const { map: settings } = useSettings();
    const { theme } = useTheme();
    const { cameraRef } = useScene();

    const directionSize = 0.06;
    const directionLength = 0.25;

    const compassRef = useRef<Group>(null);

    const compassType = settings.compass.type;
    const mainCamera = cameraRef.current;

    const textColor = useMemo(() => {
        const styles = getComputedStyle(document.documentElement);
        return styles.getPropertyValue('--compass-text-color'.trim());
    }, [theme]);

    const euler: Euler = useMemo(() => {
        return new Euler();
    }, []);

    useFpsFrame(() => {
        if (!compassRef.current || !mainCamera) return;

        if (compassType === '2D') {
            euler.setFromQuaternion(mainCamera.quaternion, 'YXZ');
            compassRef.current.rotation.set(0, 0, euler.y);
        } else {
            compassRef.current.quaternion.copy(mainCamera.quaternion);
        }
        compassRef.current.quaternion.invert();
    }, 60);

    return (
        <MeshGroup ref={compassRef}>
            <MeshGroup rotation={new Vector3(compassType === '2D' ? 90 : 0, 0, 0)}>
                {/* North arrow */}
                <BoxMesh
                    size={new Vector3(directionSize, directionSize, directionLength)}
                    position={new Vector3(0, 0, directionLength / 2 + directionSize / 2)}
                    color='blue'
                    forceEdges={'without'}
                />
                <TextMesh
                    text='N'
                    position={new Vector3(0, 0, directionLength + directionSize * 2)}
                    rotation={new Vector3(90, 180, 0)}
                    size={0.1}
                    height={0.05}
                    forceEdges='without'
                    color={textColor}
                />
                {/* South arrow */}
                <BoxMesh
                    size={new Vector3(directionSize, directionSize, directionLength)}
                    position={new Vector3(0, 0, -directionLength / 2 - directionSize / 2)}
                    color='red'
                    forceEdges={'without'}
                />
                <TextMesh
                    text='S'
                    position={new Vector3(0, 0, -directionLength - directionSize * 2)}
                    rotation={new Vector3(90, 180, 0)}
                    size={0.1}
                    height={0.05}
                    forceEdges='without'
                    color={textColor}
                />
                {/* East arrow */}
                <BoxMesh
                    size={new Vector3(directionSize, directionSize, directionLength / 3)}
                    position={new Vector3(-directionLength / 6 - directionSize / 2, 0, 0)}
                    rotation={new Vector3(0, 90, 0)}
                    color='gray'
                    forceEdges={'without'}
                />
                {/* West arrow */}
                <BoxMesh
                    size={new Vector3(directionSize, directionSize, directionLength / 3)}
                    position={new Vector3(directionLength / 6 + directionSize / 2, 0, 0)}
                    rotation={new Vector3(0, 90, 0)}
                    color='gray'
                    forceEdges={'without'}
                />
            </MeshGroup>
        </MeshGroup>
    );
};

export const CompassModel = () => {
    const { map: settings } = useSettings();
    const compassSize = settings.compass.size;

    if (!settings.compass.enable) return null;

    return (
        <div className={clsx(s['compass-wrapper'])}>
            <Canvas
                camera={{ position: [0, 0, 1], fov: 60 }}
                style={{ width: `${compassSize}px`, height: `${compassSize}px` }}>
                <Suspense fallback={<Loader type='circle' />}>
                    <ambientLight intensity={1.5} />
                    <Compass />
                </Suspense>
            </Canvas>
        </div>
    );
};
