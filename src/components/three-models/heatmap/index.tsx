import { useSettings } from '@context/use-settings';
import { useComplexData } from '@context/complex-data-context';
import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Vector3, Object3D, Vector2, ShaderMaterial, Vector4, PlaneGeometry } from 'three';
import { vertexShader, fragmentShader } from '@utils/shaders';
import { useScene } from '@context/scene-context';

interface HeatmapProps {
    basePlateSize: Vector3;
    height: number;
}

export const Heatmap = ({ basePlateSize, height }: HeatmapProps) => {
    const { map: settings } = useSettings();
    const { getStationsData, getStationByName } = useComplexData();
    const { getMeshPosition } = useScene();

    const geometryRef = useRef<PlaneGeometry>(null);
    const materialRef = useRef<ShaderMaterial>(null);

    const MAX_STATIONS = settings.atmosphere.maxStations;
    const degree = settings.atmosphere.degreeOfInterpolation;
    const scaleMin = settings.atmosphere.scale.min;
    const scaleMax = settings.atmosphere.scale.max;

    const pixelOpacity = settings.atmosphere.model.heatmap.opacity;
    const pixelAmount = settings.atmosphere.model.heatmap.pixelAmount;

    const shader = useMemo(
        () => ({
            uniforms: {
                uStations: { value: [new Vector4(0, 0, 0, 0)] },
                uStationCount: { value: 0 },
                uDegree: { value: degree },
                uMinVal: { value: scaleMin },
                uMaxVal: { value: scaleMax },
                uOpacity: { value: 1.0 },
                uScaling: { value: false },
                uScalingHeight: { value: 1.0 },
            },
            vertexShader: vertexShader(MAX_STATIONS),
            fragmentShader: fragmentShader,
        }),
        [MAX_STATIONS, degree, scaleMin, scaleMax],
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

    useLayoutEffect(() => {
        if (geometryRef.current) {
            geometryRef.current.rotateX(-Math.PI / 2);
        }
    }, [pixelAmount]);

    useFrame(() => {
        if (!materialRef.current) return;

        const targetMeasures = ['airtemperature', 'temperature'];
        const stations = Object.entries(getStationsData()).filter(([_, data]) =>
            Object.entries(data).some(
                ([measure, measurements]) =>
                    targetMeasures.includes(measure.toLowerCase()) && measurements.length,
            ),
        );

        let stationIndex = 0;
        let dataIndex = 0;

        while (stationIndex < stations.length) {
            const [name, data] = stations[stationIndex];
            const station = getStationByName(name);

            const pos = getMeshPosition(station?.id ?? '');
            let value = 0;
            for (const [measure, measurements] of Object.entries(data)) {
                if (targetMeasures.includes(measure.toLowerCase()) && measurements.length) {
                    value = measurements[measurements.length - 1].value;
                    break;
                }
            }

            if (station && pos) {
                stationsData[dataIndex].set(pos.x, pos.y, pos.z, value);
                dataIndex++;
            }
            stationIndex++;
        }
        for (let i = dataIndex; i < MAX_STATIONS; i++) {
            stationsData[i].set(0, 0, 0, 0);
        }

        const uniforms = materialRef.current.uniforms;

        uniforms.uStations.value = stationsData;
        uniforms.uStationCount.value = Math.min(dataIndex, MAX_STATIONS);
        uniforms.uDegree.value = degree;
        uniforms.uOpacity.value = pixelOpacity;
        uniforms.uMinVal.value = scaleMin;
        uniforms.uMaxVal.value = scaleMax;
    });

    if (pixelCount == 0) return null;

    return (
        <instancedMesh args={[undefined, undefined, pixelCount]} position={[0, height, 0]}>
            <instancedBufferAttribute attach='instanceMatrix' args={[instanceMatrices, 16]} />
            <planeGeometry args={[pixelSizes.x, pixelSizes.y]} ref={geometryRef} />
            <shaderMaterial
                ref={materialRef}
                args={[shader]}
                transparent
                depthWrite={false}
                depthTest={true}
                side={2}
            />
        </instancedMesh>
    );
};
