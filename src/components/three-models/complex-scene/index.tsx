import { Box3, Vector3 } from 'three';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Html } from '@react-three/drei';
import { BasePlateModel } from '@models_/base-plate-model';
import { TelescopeModel } from '@models_/telescope-model';
import { MastModel } from '@models_/mast-model';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Loader } from '@components/loader';
import { SceneReporter } from '@helpers/scene-reporter';
import { degToRad } from 'three/src/math/MathUtils.js';
import { useSceneSettings } from '@hooks/use-scene-settings';
import { AtmosphereModel } from '@models_/atmosphere-model';
import { SunModel } from '@models_/sun-model';
import { useScene } from '@context/scene-context';
import { geographicToPolar } from '@utils/coordinate-systems';
import { useComplexStore } from '@stores/complex-store';

export const ComplexScene = () => {
    const { map: settings } = useSceneSettings();
    const { controlsRef } = useScene();
    const { complex } = useComplexStore();

    const [controls, setControls] = useState<CameraControls | null>(null);

    const sceneStyle = useMemo(() => {
        return settings.scene.background.enable
            ? {
                  backgroundColor: '#24136a',
              }
            : undefined;
    }, [settings.scene.background.enable]);

    const basePlateSize = useMemo(() => {
        const size = new Vector3(20, settings.model.basePlate.height, 20);

        complex?.masts.forEach((mast) => {
            const pos = geographicToPolar(mast.latitude, mast.longitude, complex.latitude);

            size.x = Math.max(size.x, 2 * Math.abs(pos.x));
            size.z = Math.max(size.z, 2 * Math.abs(pos.y));
        });

        size.x += settings.model.basePlate.padding;
        size.z += settings.model.basePlate.padding;

        if (settings.model.basePlate.square) {
            size.x = Math.max(size.x, size.z);
            size.z = Math.max(size.x, size.z);
        }

        return size;
    }, [
        settings.model.basePlate.height,
        settings.model.basePlate.padding,
        settings.model.basePlate.square,
        complex,
    ]);

    const cameraProps = {
        position: new Vector3(
            basePlateSize.x,
            settings.atmosphere.model.particles.height * 2,
            -basePlateSize.z,
        ),
        fov: 60,
    };

    useEffect(() => {
        if (!controls) return;

        if (settings.camera.noLimits) {
            controls.setBoundary(undefined);
            return;
        }

        const box = new Box3(
            new Vector3(-basePlateSize.x / 2, 0, -basePlateSize.z / 2),
            new Vector3(
                basePlateSize.x / 2,
                settings.atmosphere.model.particles.height * 2,
                basePlateSize.z / 2,
            ),
        );

        controls.setBoundary(box);
        controls.update(0);
    }, [
        controls,
        basePlateSize,
        settings.camera.noLimits,
        settings.atmosphere.model.particles.height,
    ]);

    return (
        <Canvas camera={cameraProps} style={sceneStyle} shadows>
            <Suspense
                fallback={
                    <Html center>
                        <Loader />
                    </Html>
                }>
                {settings.scene.light.ambient.enable && (
                    <ambientLight
                        intensity={settings.scene.light.ambient.intensity}
                        color={settings.scene.light.ambient.color}
                    />
                )}
                <SunModel basePlateSize={basePlateSize} />

                <SceneReporter />

                {settings.model.basePlate.enable && <BasePlateModel size={basePlateSize} />}
                {settings.model.telescope.enable && (
                    <TelescopeModel
                        height={settings.model.telescope.height}
                        radius={settings.model.telescope.radius}
                        length={settings.model.telescope.length}
                    />
                )}

                {complex && complex.masts.map((item) => <MastModel data={item} />)}
                {settings.atmosphere.enable && (
                    <>
                        <AtmosphereModel basePlateSize={basePlateSize} />
                    </>
                )}
            </Suspense>

            {settings.scene.grid.enable && <gridHelper args={[basePlateSize.x, basePlateSize.z]} />}

            <CameraControls
                minDistance={!settings.camera.noLimits ? settings.camera.minDistance : 0}
                maxDistance={!settings.camera.noLimits ? settings.camera.maxDistance : 10_000}
                maxPolarAngle={degToRad(
                    !settings.camera.noLimits ? settings.camera.maxPolarAngle : 360,
                )}
                ref={(node) => {
                    if (node) {
                        setControls(node);
                        controlsRef.current = node;
                    }
                }}
                makeDefault
            />
        </Canvas>
    );
};
