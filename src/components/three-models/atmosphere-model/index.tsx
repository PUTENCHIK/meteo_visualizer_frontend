import { useSettings } from '@context/use-settings';
import { useMemo, useRef } from 'react';
import { Vector3, Object3D, ShaderMaterial, Vector4 } from 'three';
import { vertexShader, fragmentShader } from '@utils/shaders';
import { useFpsFrame } from '@hooks/use-fps-frame';
import { useComplexStore } from '@stores/complex-store';
import { devicesStore } from '@stores/devices-store';
import { MAX_MEASURE_COLORS, parseColor } from '@utils/common';
import type { ShaderData, StrictUniforms } from './shaders';
import { layoutStrategies } from './strategies';

export type AtmosphereParticleForm = 'sphere' | 'cube';

export type AtmosphereModelType = 'particles' | 'heatmap' | 'pillarmap';

interface AtmosphereModelProps {
    basePlateSize: Vector3;
}

export const AtmosphereModel = ({ basePlateSize }: AtmosphereModelProps) => {
    const { map: settings } = useSettings();
    const { measure } = useComplexStore();

    const materialRef = useRef<ShaderMaterial>(null);

    const MAX_STATIONS = settings.atmosphere.maxStations;
    const MAX_COLORS = MAX_MEASURE_COLORS;
    const degree = settings.atmosphere.degreeOfInterpolation;
    const atmosphereType = settings.atmosphere.model.value as AtmosphereModelType;

    const strategy = layoutStrategies[atmosphereType];

    const { positions, count, opacity, instancedMeshPosition } = useMemo(() => {
        return strategy.getLayout({ basePlateSize, settings });
    }, [strategy, basePlateSize, settings, strategy.getDeps(settings)]);

    const stationsData = useMemo(
        () => new Array(MAX_STATIONS).fill(null).map(() => new Vector4(0, 0, 0, 0)),
        [MAX_STATIONS],
    );

    const colorsData = useMemo(() => {
        const colors = [...(measure?.colors ?? [])].sort((a, b) => a.percent - b.percent);
        const data = new Array(MAX_COLORS).fill(null).map(() => new Vector4(0.5, 0.5, 0.5, 1));

        for (let i = 0; i < colors.length; i++) {
            if (i < MAX_COLORS) {
                const c = colors[i];
                const color = parseColor(c.value, true);
                data[i].set(color.r, color.g, color.b, c.percent);
            }
        }

        return data;
    }, [MAX_COLORS, measure]);

    const shader: ShaderData = useMemo(() => {
        const customUniforms = strategy.getExtraUniforms({ basePlateSize, settings });
        const commonUniforms = {
            uStations: { value: stationsData },
            uStationCount: { value: 0 },
            uColors: { value: colorsData },
            uColorCount: { value: 0 },
            uDegree: { value: 1 },
            uMinVal: { value: 0 },
            uMaxVal: { value: 1 },
            uOpacity: { value: 1 },
            uScaling: { value: false },
            uScalingHeight: { value: 1.0 },
        };

        return {
            uniforms: {
                ...commonUniforms,
                ...customUniforms,
            },
            vertexShader: vertexShader(MAX_STATIONS),
            fragmentShader: fragmentShader(MAX_COLORS),
        };
    }, [
        MAX_STATIONS,
        MAX_COLORS,
        stationsData,
        colorsData,
        strategy,
        basePlateSize,
        settings,
        strategy.getShaderDeps(settings),
    ]);

    const instanceMatrices = useMemo(() => {
        if (count === 0) return new Float32Array(0);

        const array = new Float32Array(count * 16);
        const obj = new Object3D();
        positions.forEach((pos, i) => {
            obj.position.copy(pos);
            obj.updateMatrix();
            obj.matrix.toArray(array, i * 16);
        });
        return array;
    }, [positions, count]);

    useFpsFrame(() => {
        if (!materialRef.current) return;

        const filteredDevices = devicesStore.getAtmosphereData();

        let dataIndex = 0;
        for (const deviceId in filteredDevices) {
            const data = filteredDevices[deviceId];
            stationsData[dataIndex].set(
                data.position.x,
                data.position.y,
                data.position.z,
                data.value,
            );
            dataIndex++;
        }
        for (let i = dataIndex; i < MAX_STATIONS; i++) {
            stationsData[i].set(0, 0, 0, 0);
        }

        const uniforms = materialRef.current.uniforms as StrictUniforms;

        uniforms.uStations.value = stationsData;
        uniforms.uStationCount.value = Math.min(dataIndex, MAX_STATIONS);
        uniforms.uColors.value = colorsData;
        uniforms.uColorCount.value = Math.min(colorsData.length, MAX_COLORS);
        uniforms.uDegree.value = degree;
        uniforms.uOpacity.value = opacity;
        uniforms.uMinVal.value = measure?.min ?? 0;
        uniforms.uMaxVal.value = measure?.max ?? 1;
    }, settings.atmosphere.fps);

    if (count == 0) return null;

    return (
        <instancedMesh args={[undefined, undefined, count]} position={instancedMeshPosition}>
            <instancedBufferAttribute attach='instanceMatrix' args={[instanceMatrices, 16]} />
            {strategy.renderGeometry({ basePlateSize, settings })}
            <shaderMaterial ref={materialRef} args={[shader]} transparent />
        </instancedMesh>
    );
};
