import { useScene } from '@context/scene-context';
import { useSettings } from '@context/use-settings';
import { useComplexStore } from '@stores/complex-store';
import type { MastSchema } from '@utils/schemas';
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

    const getMast = (mastId: Guid): MastSchema | undefined => {
        const complex = useComplexStore.getState().complex;
        return complex?.masts.find((m) => m.id === mastId);
    };

    const focusMast = (mastId: Guid) => {
        const mast = getMast(mastId);
        if (mast) {
            const height = mast.config?.height;
            focusObject(mastId, new Vector3(0, (height ?? 0) / 2, 0), mast.rotation);
        } else {
            console.error(`Mast #${mastId} is undefined`);
        }
    };

    const focusStation = (stationId: Guid, mastId: Guid) => {
        const mast = getMast(mastId);
        if (mast) {
            focusObject(stationId, new Vector3(), mast.rotation);
        } else {
            console.error(`Mast #${mastId} is undefined`);
        }
    };

    return { focusMast, focusStation, focusObject };
};
