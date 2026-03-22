import { useSettings } from '@context/use-settings';
import { useMemo, useRef } from 'react';
import { Vector3, Object3D, Vector2, ShaderMaterial, Vector4 } from 'three';
import { vertexShader, fragmentShader } from '@utils/shaders';
import { useFpsFrame } from '@hooks/use-fps-frame';
import { useDevicesStore, useMeasureScale } from '@context/devices-data-context';

interface PillarmapProps {
    basePlateSize: Vector3;
    height: number;
}

export const Pillarmap = ({ basePlateSize, height }: PillarmapProps) => {
    const { map: settings } = useSettings();
    const store = useDevicesStore();

    const materialRef = useRef<ShaderMaterial>(null);

    const MAX_STATIONS = settings.atmosphere.maxStations;
    const degree = settings.atmosphere.degreeOfInterpolation;
    const scale = useMeasureScale();

    const pixelOpacity = settings.atmosphere.model.pillarmap.opacity;
    const pixelAmount = settings.atmosphere.model.pillarmap.pixelAmount;

    const shader = useMemo(
        () => ({
            uniforms: {
                uStations: { value: [new Vector4(0, 0, 0, 0)] },
                uStationCount: { value: 0 },
                uDegree: { value: degree },
                uMinVal: { value: scale.min },
                uMaxVal: { value: scale.max },
                uOpacity: { value: 1.0 },
                uScaling: { value: true },
                uScalingHeight: { value: height },
            },
            vertexShader: vertexShader(MAX_STATIONS),
            fragmentShader: fragmentShader,
        }),
        [MAX_STATIONS, degree, scale, height],
    );

    const pixelSizes: Vector2 = useMemo(() => {
        return new Vector2(basePlateSize.x / pixelAmount, basePlateSize.z / pixelAmount);
    }, [basePlateSize.x, basePlateSize.z, pixelAmount]);

    const { pixelPositions, pixelCount } = useMemo(() => {
        const list: Vector3[] = [];

        for (let i = 0; i < pixelAmount; i++) {
            for (let j = 0; j < pixelAmount; j++) {
                list.push(
                    new Vector3(
                        -basePlateSize.x / 2 + (i + 0.5) * pixelSizes.x,
                        0,
                        -basePlateSize.z / 2 + (j + 0.5) * pixelSizes.y,
                    ),
                );
            }
        }
        return { pixelPositions: list, pixelCount: list.length };
    }, [basePlateSize, pixelAmount, pixelSizes.x, pixelSizes.y]);

    const instanceMatrices = useMemo(() => {
        if (pixelCount === 0) return new Float32Array(0);

        const array = new Float32Array(pixelCount * 16);
        const obj = new Object3D();
        pixelPositions.forEach((pos, i) => {
            obj.position.copy(pos);
            obj.updateMatrix();
            obj.matrix.toArray(array, i * 16);
        });
        return array;
    }, [pixelPositions, pixelCount]);

    const stationsData = useMemo(
        () => new Array(MAX_STATIONS).fill(null).map(() => new Vector4()),
        [MAX_STATIONS],
    );

    useFpsFrame(() => {
        if (!materialRef.current) return;

        const filteredDevices = store.getAtmosphereData();

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

        const uniforms = materialRef.current.uniforms;

        uniforms.uStations.value = stationsData;
        uniforms.uStationCount.value = Math.min(dataIndex, MAX_STATIONS);
        uniforms.uDegree.value = degree;
        uniforms.uOpacity.value = pixelOpacity;
        uniforms.uMinVal.value = scale.min;
        uniforms.uMaxVal.value = scale.max;
    }, settings.atmosphere.fps);

    if (pixelCount == 0) return null;

    return (
        <instancedMesh args={[undefined, undefined, pixelCount]} position={[0, 0.5, 0]}>
            <instancedBufferAttribute attach='instanceMatrix' args={[instanceMatrices, 16]} />
            <boxGeometry args={[pixelSizes.x, 1, pixelSizes.y]} />
            <shaderMaterial ref={materialRef} args={[shader]} transparent />
        </instancedMesh>
    );
};
