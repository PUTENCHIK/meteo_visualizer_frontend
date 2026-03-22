import { useScene } from '@context/scene-context';
import { useSettings } from '@context/use-settings';
import { useComplexStore } from '@stores/complex-store';
import { Vector3 } from 'three';
import type { Guid } from 'typescript-guid';

export const useFocus = () => {
    const { map: settings } = useSettings();
    const { controlsRef, sceneRef } = useScene();

    const focusObject = (id: Guid, targetOffset?: Vector3) => {
        const controls = controlsRef.current;
        const scene = sceneRef.current;
        if (controls && scene) {
            const target = scene.getObjectByName(id.toString());

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

    const focusMast = (mastId: Guid) => {
        const mast = useComplexStore.getState().getMast(mastId);
        if (mast) {
            focusObject(mastId, new Vector3(0, mast.height / 2, 0));
        } else {
            console.error(`Mast #${mastId} is undefined`);
        }
    };

    const focusStation = (stationId: Guid) => {
        focusObject(stationId);
    };

    return { focusMast, focusStation, focusObject };
};
