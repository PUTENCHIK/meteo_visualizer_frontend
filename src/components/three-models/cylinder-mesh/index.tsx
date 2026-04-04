import type { Mesh, Vector3 } from 'three';
import { Edges, Outlines } from '@react-three/drei';
import { useSettings } from '@context/use-settings';
import type { EdgesEnable, Namable, Shadowable } from '@utils/three-models';
import { forwardRef } from 'react';

interface CylinderMeshProps extends EdgesEnable, Namable, Shadowable {
    radius: number;
    height: number;
    position: Vector3;
    segments?: number;
    color: string;
}

export const CylinderMesh = forwardRef<Mesh, CylinderMeshProps>(
    (
        {
            name,
            radius,
            height,
            position,
            segments = 32,
            color,
            forceEdges,
            forceShadow,
        }: CylinderMeshProps,
        ref,
    ) => {
        const { map: settings } = useSettings();

        const isShadow =
            forceShadow === 'with' || (forceShadow !== 'without' && settings.scene.shadows.enable);
        const isEdges =
            forceEdges === 'with' || (forceEdges !== 'without' && settings.scene.edges.enable);

        return (
            <mesh
                name={name}
                position={position}
                castShadow={isShadow}
                receiveShadow={isShadow}
                ref={ref}>
                <cylinderGeometry args={[radius, radius, height, segments]} />
                <meshStandardMaterial color={color} />
                {isEdges && (
                    <>
                        <Edges
                            color={settings.scene.edges.color}
                            threshold={15}
                            lineWidth={settings.scene.edges.thickness}
                        />
                        <Outlines
                            color={settings.scene.edges.color}
                            thickness={settings.scene.edges.thickness}
                        />
                    </>
                )}
            </mesh>
        );
    },
);
