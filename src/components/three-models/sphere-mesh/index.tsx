import { Vector3, type Mesh } from 'three';
import { Outlines } from '@react-three/drei';
import { useSceneSettings } from '@hooks/use-scene-settings';
import { forwardRef } from 'react';
import type { EdgesEnable, Namable, Shadowable } from '@utils/three-models';
import type { ThreeEvent } from '@react-three/fiber';

interface SphereMeshProps extends EdgesEnable, Namable, Shadowable {
    radius: number;
    position?: Vector3;
    segments?: number;
    color: string;
    onClick?: (e: ThreeEvent<MouseEvent>) => void;
    onPointerOver?: () => void;
    onPointerOut?: () => void;
}

export const SphereMesh = forwardRef<Mesh, SphereMeshProps>(
    (
        {
            name,
            radius,
            position = new Vector3(),
            segments = 32,
            color,
            forceEdges,
            forceShadow,
            onClick,
            onPointerOver,
            onPointerOut,
        }: SphereMeshProps,
        ref,
    ) => {
        const { map: settings } = useSceneSettings();

        const isShadow =
            forceShadow === 'with' || (forceShadow !== 'without' && settings.scene.shadows.enable);
        const isEdges =
            forceEdges === 'with' || (forceEdges !== 'without' && settings.scene.edges.enable);

        return (
            <mesh
                name={name}
                position={position}
                onClick={onClick}
                castShadow={isShadow}
                receiveShadow={isShadow}
                onPointerOver={onPointerOver}
                onPointerOut={onPointerOut}
                ref={ref}>
                <sphereGeometry args={[radius, segments, segments]} />
                <meshStandardMaterial color={color} />
                {isEdges && (
                    <Outlines
                        color={settings.scene.edges.color}
                        thickness={settings.scene.edges.thickness}
                    />
                )}
            </mesh>
        );
    },
);
