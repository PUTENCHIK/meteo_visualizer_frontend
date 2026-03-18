import { useComplexData } from '@context/complex-data-context';
import { useSettings } from '@context/use-settings';
import { useFpsFrame } from '@hooks/use-fps-frame';
import { SphereMesh } from '@models_/sphere-mesh';
import { getSunPosition, sunPosToLocal } from '@utils/coordinate-systems';
import { useRef } from 'react';
import type { DirectionalLight, Mesh } from 'three';

export const SunModel = () => {
    const { map: settings } = useSettings();
    const { position: complexPosition } = useComplexData();

    const sunRef = useRef<Mesh>(null);
    const directionalLightRef = useRef<DirectionalLight>(null);

    useFpsFrame(() => {
        if (!sunRef.current && !directionalLightRef.current) return;

        const { azimuth: a, elevation: e } = getSunPosition(complexPosition);
        const targetPos = sunPosToLocal(a, e, settings.model.sun.orbitalRadius);
        sunRef.current?.position.copy(targetPos);
        directionalLightRef.current?.position.copy(targetPos);
    }, 60);

    return (
        <>
            {settings.model.sun.enable && (
                <SphereMesh
                    color={settings.model.sun.color}
                    radius={settings.model.sun.size}
                    ref={sunRef}
                />
            )}
            {settings.scene.light.directional.enable && (
                <directionalLight
                    intensity={settings.scene.light.directional.intensity}
                    color={settings.scene.light.directional.color}
                    ref={directionalLightRef}
                />
            )}
        </>
    );
};
