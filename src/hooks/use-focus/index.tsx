import { useScene } from '@context/scene-context';
import { useSettings } from '@context/use-settings';
import { useComplexStore } from '@stores/complex-store';
import { Box3, PerspectiveCamera, Sphere, Vector3 } from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import type { Guid } from 'typescript-guid';

export const useFocus = () => {
    const { map: settings } = useSettings();
    const { controlsRef, sceneRef, cameraRef } = useScene();

    const focusObject = (id: Guid, targetOffset?: Vector3, rotationY: number = 0) => {
        const controls = controlsRef.current;
        const scene = sceneRef.current;
        const camera = cameraRef.current as PerspectiveCamera;
        if (controls && scene && camera) {
            const target = scene.getObjectByName(id.toString());

            if (target) {
                const p = new Vector3();
                target.getWorldPosition(p);
                const offset = settings.camera.focusOffset;
                const padding = settings.camera.focusPadding;

                const box = new Box3().setFromObject(target);
                const sphere = box.getBoundingSphere(new Sphere());

                const fov = degToRad(camera.fov);
                const distance = (sphere.radius + padding) / Math.tan(fov / 2);

                controls.setLookAt(
                    p.x - Math.sin(degToRad(rotationY)) * distance,
                    p.y + distance / 2 + offset / 2,
                    p.z - Math.cos(degToRad(rotationY)) * distance - offset,
                    p.x + (targetOffset?.x ?? 0),
                    p.y + (targetOffset?.y ?? 0),
                    p.z + (targetOffset?.z ?? 0),
                    true,
                );
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
            focusObject(mastId, new Vector3(0, mast.height / 2, 0), mast.rotation);
        } else {
            console.error(`Mast #${mastId} is undefined`);
        }
    };

    const focusStation = (stationId: Guid) => {
        const station = useComplexStore.getState().getStation(stationId);
        if (!station) {
            console.error(`Station #${stationId} is undefined`);
            return;
        }
        const mast = useComplexStore.getState().getMast(station.mastId);
        if (!mast) {
            console.error(`Mast #${station.mastId} is undefined`);
            return;
        }
        focusObject(stationId, new Vector3(), mast.rotation);
    };

    return { focusMast, focusStation, focusObject };
};
