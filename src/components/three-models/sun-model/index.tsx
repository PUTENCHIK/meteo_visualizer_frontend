import { useComplexData } from '@context/complex-data-context';
import { useSettings } from '@context/use-settings';
import { useFpsFrame } from '@hooks/use-fps-frame';
import { SphereMesh } from '@models_/sphere-mesh';
import { getSunPosition, sunPosToLocal } from '@utils/coordinate-systems';
import { useEffect, useRef } from 'react';
import { type DirectionalLight, type Mesh, type Vector3 } from 'three';

interface SunModelProps {
    basePlateSize: Vector3;
}

export const SunModel = ({ basePlateSize }: SunModelProps) => {
    const { map: settings } = useSettings();
    const { position: complexPosition } = useComplexData();

    const sunRef = useRef<Mesh>(null);
    const directionalLightRef = useRef<DirectionalLight>(null);

    const mapSize = settings.scene.shadows.mapSize;

    useFpsFrame(() => {
        if (!sunRef.current && !directionalLightRef.current) return;

        const { azimuth: a, elevation: e } = getSunPosition(complexPosition);
        const targetPos = sunPosToLocal(a, e, settings.model.sun.orbitalRadius);
        sunRef.current?.position.copy(targetPos);
        directionalLightRef.current?.position.copy(targetPos);
    }, 60);

    useEffect(() => {
        if (directionalLightRef.current) {
            const light = directionalLightRef.current;

            light.shadow.map?.dispose();
            light.shadow.map = null;

            light.shadow.camera.updateProjectionMatrix();
            light.shadow.needsUpdate = true;
        }
    }, [mapSize]);

    return (
        <>
            {settings.model.sun.enable && (
                <SphereMesh
                    color={settings.model.sun.color}
                    radius={settings.model.sun.size}
                    forceEdges='without'
                    forceShadow='without'
                    ref={sunRef}
                />
            )}
            {settings.scene.light.directional.enable && (
                <directionalLight
                    intensity={settings.scene.light.directional.intensity}
                    color={settings.scene.light.directional.color}
                    castShadow
                    shadow-mapSize={[mapSize, mapSize]}
                    shadow-camera-left={-basePlateSize.x / 1.5}
                    shadow-camera-right={basePlateSize.x / 1.5}
                    shadow-camera-top={-basePlateSize.z / 1.5}
                    shadow-camera-bottom={basePlateSize.z / 1.5}
                    shadow-camera-far={1000}
                    shadow-camera-near={0.1}
                    shadow-bias={-0.005}
                    shadow-normalBias={0.02}
                    ref={directionalLightRef}
                />
            )}
        </>
    );
};
