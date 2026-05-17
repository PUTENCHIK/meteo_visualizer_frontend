import clsx from 'clsx';
import s from './compass-model.module.scss';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import { BoxMesh } from '@models_/box-mesh';
import { Euler, Group, Vector3 } from 'three';
import { MeshGroup } from '@models_/mesh-group';
import { Loader } from '@components/loader';
import { TextMesh } from '@models_/text-mesh';
import { useScene } from '@context/scene-context';
import { useFpsFrame } from '@hooks/use-fps-frame';
import { Html } from '@react-three/drei';
import { useAppSettings } from '@hooks/use-app-settings';

export type CompassType = '2D' | '3D';

const Compass = () => {
    const { map: appSettings } = useAppSettings();
    const { cameraRef } = useScene();

    const directionSize = 0.06;
    const directionLength = 0.25;

    const compassRef = useRef<Group>(null);

    const compassType = appSettings.complexPage.compass.type;
    const mainCamera = cameraRef.current;

    const textColor = useMemo(() => {
        const styles = getComputedStyle(document.documentElement);
        return styles.getPropertyValue('--compass-text-color'.trim());
    }, [appSettings.common.theme]);

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
    const { map: settings } = useAppSettings();
    const compassSize = settings.complexPage.compass.size;

    if (!settings.complexPage.compass.enable) return null;

    return (
        <div className={clsx(s['compass-wrapper'])}>
            <Canvas
                camera={{ position: [0, 0, 1], fov: 60 }}
                style={{ width: `${compassSize}px`, height: `${compassSize}px` }}>
                <Suspense
                    fallback={
                        <Html center>
                            <Loader />
                        </Html>
                    }>
                    <ambientLight intensity={1.5} />
                    <Compass />
                </Suspense>
            </Canvas>
        </div>
    );
};
