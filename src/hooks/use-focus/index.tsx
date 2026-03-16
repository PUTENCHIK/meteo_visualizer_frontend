import { useComplexData } from '@context/complex-data-context';
import { useScene } from '@context/scene-context';
import { useSettings } from '@context/use-settings';
import { getMastConfig } from '@utils/complexes';
import { Vector3 } from 'three';

export const useFocus = () => {
    const { map: settings } = useSettings();
    const { getMastById } = useComplexData();
    const { controlsRef, sceneRef } = useScene();

    const focusObject = (id: string, targetOffset?: Vector3) => {
        const controls = controlsRef.current;
        const scene = sceneRef.current;
        if (controls && scene) {
            const target = scene.getObjectByName(id);

            if (target) {
                const p = new Vector3();
                target.getWorldPosition(p);
                const offset = settings.camera.focusOffset;
                const padding = settings.camera.focusPadding;

                controls.setLookAt(
                    p.x,
                    p.y + offset / 2,
                    p.z - offset,
                    p.x + (targetOffset?.x ?? 0),
                    p.y + (targetOffset?.y ?? 0),
                    p.z + (targetOffset?.z ?? 0),
                    true,
                );
                controls.fitToBox(target, true, {
                    paddingBottom: padding,
                    paddingTop: padding,
                    paddingLeft: padding,
                    paddingRight: padding,
                });
            } else {
                console.error(`Target mesh is undefined: ${target}`);
            }
        } else {
            console.error(`Controls and Scene objects must be set: ${controls}, ${scene}`);
        }
    };

    const focusMast = (mastId: string) => {
        const mast = getMastById(mastId);
        if (mast) {
            const mastHeight = getMastConfig(mast.configName).height;
            focusObject(mastId, new Vector3(0, mastHeight / 2, 0));
        } else {
            console.error(`Mast #${mastId} is undefined`);
        }
    };

    const focusStation = (stationId: string) => {
        focusObject(stationId);
    };

    return { focusMast, focusStation, focusObject };
};
