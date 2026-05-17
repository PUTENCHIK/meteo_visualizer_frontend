import type { SceneSettingsMapType } from '@hooks/use-scene-settings';
import { Vector2, Vector3 } from 'three';
import type { AtmosphereModelType } from '.';
import type { CustomUniforms } from './shaders';

export interface LayoutResult {
    positions: Vector3[];
    count: number;
    opacity: number;
    instancedMeshPosition?: Vector3;
}

interface LayoutParams {
    basePlateSize: Vector3;
    settings: SceneSettingsMapType;
}

interface LayoutStrategy {
    getLayout: (params: LayoutParams) => LayoutResult;
    renderGeometry: (params: LayoutParams) => React.ReactNode;
    getExtraUniforms: (params: LayoutParams) => Partial<CustomUniforms>;
    getDeps: (settings: SceneSettingsMapType) => any[];
    getShaderDeps: (settings: SceneSettingsMapType) => any[];
}

const getPixelSize = (basePlateSize: Vector3, pixelAmount: number): Vector2 => {
    return new Vector2(basePlateSize.x / pixelAmount, basePlateSize.z / pixelAmount);
};

export const layoutStrategies: Record<AtmosphereModelType, LayoutStrategy> = {
    particles: {
        getLayout: ({ basePlateSize, settings }) => {
            const minParticles = 2;
            const height = settings.atmosphere.model.particles.height;
            const size = settings.atmosphere.model.particles.size;
            const frequency = settings.atmosphere.model.particles.frequency;
            const opacity = settings.atmosphere.model.particles.opacity;

            const list: Vector3[] = [];
            const count = new Vector3(
                (basePlateSize.x / size) * frequency,
                (height / size) * frequency,
                (basePlateSize.z / size) * frequency,
            );
            count.x = Math.max(Math.floor(count.x), minParticles);
            count.y = Math.max(Math.floor(count.y), minParticles);
            count.z = Math.max(Math.floor(count.z), minParticles);

            const delta = new Vector3(
                (basePlateSize.x - count.x * size) / (count.x - 1),
                (height - count.y * size) / (count.y - 1),
                (basePlateSize.z - count.z * size) / (count.z - 1),
            );
            for (let x = 0; x < count.x; x += 1) {
                for (let y = 0; y < count.y; y += 1) {
                    for (let z = 0; z < count.z; z += 1) {
                        list.push(
                            new Vector3(
                                -basePlateSize.x / 2 + x * (delta.x + size) + size / 2,
                                y * (delta.y + size) + size / 2,
                                -basePlateSize.z / 2 + z * (delta.z + size) + size / 2,
                            ),
                        );
                    }
                }
            }

            return { positions: list, count: list.length, opacity };
        },
        renderGeometry: ({ settings }) => {
            const form = settings.atmosphere.model.particles.form;
            const size = settings.atmosphere.model.particles.size;
            const segments = settings.atmosphere.model.particles.segments;
            if (form === 'cube') {
                return <boxGeometry args={[size, size, size]} />;
            } else if (form === 'sphere') {
                return <sphereGeometry args={[size / 2, segments, segments]} />;
            } else {
                return 'error';
            }
        },
        getExtraUniforms: () => {
            return {
                uScaling: { value: false },
                uScalingHeight: { value: 1.0 },
            };
        },
        getDeps: (settings) => [
            settings.atmosphere.model.particles.height,
            settings.atmosphere.model.particles.size,
            settings.atmosphere.model.particles.frequency,
            settings.atmosphere.model.particles.opacity,
            settings.atmosphere.model.particles.form,
            settings.atmosphere.model.particles.segments,
        ],
        getShaderDeps: () => [],
    },
    heatmap: {
        getLayout: ({ basePlateSize, settings }) => {
            const list: Vector3[] = [];
            const height = settings.atmosphere.model.heatmap.height;
            const amount = settings.atmosphere.model.heatmap.pixelAmount;
            const pixelSize = getPixelSize(basePlateSize, amount);
            const opacity = settings.atmosphere.model.heatmap.opacity;

            for (let i = 0; i < amount; i++) {
                for (let j = 0; j < amount; j++) {
                    list.push(
                        new Vector3(
                            -basePlateSize.x / 2 + (i + 0.5) * pixelSize.x,
                            0,
                            -basePlateSize.z / 2 + (j + 0.5) * pixelSize.y,
                        ),
                    );
                }
            }
            return {
                positions: list,
                count: list.length,
                opacity,
                instancedMeshPosition: new Vector3(0, height, 0),
            };
        },
        renderGeometry: ({ basePlateSize, settings }) => {
            const amount = settings.atmosphere.model.heatmap.pixelAmount;
            const pixelSize = getPixelSize(basePlateSize, amount);
            return <boxGeometry args={[pixelSize.x, 0.1, pixelSize.y]} />;
        },
        getExtraUniforms: () => {
            return {
                uScaling: { value: false },
                uScalingHeight: { value: 1.0 },
            };
        },
        getDeps: (settings) => [
            settings.atmosphere.model.heatmap.height,
            settings.atmosphere.model.heatmap.pixelAmount,
            settings.atmosphere.model.heatmap.opacity,
        ],
        getShaderDeps: () => [],
    },
    pillarmap: {
        getLayout: ({ basePlateSize, settings }) => {
            const list: Vector3[] = [];
            const amount = settings.atmosphere.model.pillarmap.pixelAmount;
            const pixelSize = getPixelSize(basePlateSize, amount);
            const opacity = settings.atmosphere.model.pillarmap.opacity;

            for (let i = 0; i < amount; i++) {
                for (let j = 0; j < amount; j++) {
                    list.push(
                        new Vector3(
                            -basePlateSize.x / 2 + (i + 0.5) * pixelSize.x,
                            0,
                            -basePlateSize.z / 2 + (j + 0.5) * pixelSize.y,
                        ),
                    );
                }
            }
            return {
                positions: list,
                count: list.length,
                opacity,
                instancedMeshPosition: new Vector3(0, 0.6, 0),
            };
        },
        renderGeometry: ({ basePlateSize, settings }) => {
            const amount = settings.atmosphere.model.pillarmap.pixelAmount;
            const pixelSize = getPixelSize(basePlateSize, amount);
            return <boxGeometry args={[pixelSize.x, 1, pixelSize.y]} />;
        },
        getExtraUniforms: ({ settings }) => {
            const height = settings.atmosphere.model.pillarmap.height;
            return {
                uScaling: { value: true },
                uScalingHeight: { value: height },
            };
        },
        getDeps: (settings) => [
            settings.atmosphere.model.pillarmap.opacity,
            settings.atmosphere.model.pillarmap.pixelAmount,
            settings.atmosphere.model.pillarmap.height,
        ],
        getShaderDeps: (settings) => [settings.atmosphere.model.pillarmap.height],
    },
};
