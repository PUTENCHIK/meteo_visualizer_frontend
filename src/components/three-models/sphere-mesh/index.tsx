import { Vector3, type Mesh } from 'three';
import { Outlines } from '@react-three/drei';
import { useSettings } from '@context/use-settings';
import { forwardRef } from 'react';
import type { EdgesEnable, Namable } from '@utils/three-models';

interface SphereMeshProps extends EdgesEnable, Namable {
    radius: number;
    position?: Vector3;
    segments?: number;
    color: string;
    onClick?: () => void;
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
            onClick,
            onPointerOver,
            onPointerOut,
        }: SphereMeshProps,
        ref,
    ) => {
        const { map: settings } = useSettings();

        return (
            <mesh
                name={name}
                position={position}
                onClick={onClick}
                onPointerOver={onPointerOver}
                onPointerOut={onPointerOut}
                ref={ref}>
                <sphereGeometry args={[radius, segments, segments]} />
                <meshStandardMaterial color={color} />
                {(forceEdges === 'with' ||
                    (forceEdges !== 'without' && settings.scene.edges.enable)) && (
                    <Outlines
                        color={settings.scene.edges.color}
                        thickness={settings.scene.edges.thickness}
                        scale={settings.scene.edges.scale}
                    />
                )}
            </mesh>
        );
    },
);
