import { Mesh, Vector3 } from 'three';
import { Edges } from '@react-three/drei';
import { forwardRef } from 'react';
import { degToRad } from 'three/src/math/MathUtils.js';
import { useSceneSettings } from '@hooks/use-scene-settings';
import type { EdgesEnable, Shadowable } from '@utils/three-models';

interface BoxMeshProps extends EdgesEnable, Shadowable {
    size: Vector3;
    position?: Vector3;
    rotation?: Vector3;
    color: string;
}

export const BoxMesh = forwardRef<Mesh, BoxMeshProps>(
    (
        {
            size,
            position = new Vector3(),
            rotation = new Vector3(),
            color,
            forceEdges,
            forceShadow,
        }: BoxMeshProps,
        ref,
    ) => {
        const { map: settings } = useSceneSettings();

        const isShadow =
            forceShadow === 'with' || (forceShadow !== 'without' && settings.scene.shadows.enable);
        const isEdges =
            forceEdges === 'with' || (forceEdges !== 'without' && settings.scene.edges.enable);

        return (
            <mesh
                position={position}
                rotation={[degToRad(rotation.x), degToRad(rotation.y), degToRad(rotation.z)]}
                castShadow={isShadow}
                receiveShadow={isShadow}
                ref={ref}>
                <boxGeometry args={size.toArray()} />
                <meshStandardMaterial color={color} />
                {isEdges && (
                    <Edges
                        color={settings.scene.edges.color}
                        threshold={15}
                        lineWidth={settings.scene.edges.thickness}
                    />
                )}
            </mesh>
        );
    },
);
