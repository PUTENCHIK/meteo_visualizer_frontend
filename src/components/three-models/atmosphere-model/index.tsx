import { useSettings } from '@context/use-settings';
import { useComplexData } from '@context/complex-data-context';
import { useMemo, useRef } from 'react';
import { Object3D, ShaderMaterial, Vector3, Vector4 } from 'three';
import { vertexShader, fragmentShader } from '@utils/shaders';
import { useScene } from '@context/scene-context';
import { useFpsFrame } from '@hooks/use-fps-frame';

export type AtmosphereParticleForm = 'sphere' | 'cube';

interface AtmosphereModelProps {
    basePlateSize: Vector3;
    height: number;
}

export const AtmosphereModel = ({ basePlateSize, height }: AtmosphereModelProps) => {
    const { map: settings } = useSettings();
    const { getStationsData, getStationByName, getMeasureScale } = useComplexData();
    const { getMeshPosition } = useScene();

    const materialRef = useRef<ShaderMaterial>(null);

    const MAX_STATIONS = settings.atmosphere.maxStations;
    const degree = settings.atmosphere.degreeOfInterpolation;
    const scaleMin = getMeasureScale().min;
    const scaleMax = getMeasureScale().max;

    const particleSize = settings.atmosphere.model.particles.size;
    const particleSegments = settings.atmosphere.model.particles.segments;
    const particleFrequency = settings.atmosphere.model.particles.frequency;
    const particleForm = settings.atmosphere.model.particles.form;
    const particleOpacity = settings.atmosphere.model.particles.opacity;

    const shader = useMemo(
        () => ({
            uniforms: {
                uStations: { value: [new Vector4(0, 0, 0, 0)] },
                uStationCount: { value: 0 },
                uDegree: { value: degree },
                uMinVal: { value: scaleMin },
                uMaxVal: { value: scaleMax },
                uOpacity: { value: 1.0 },
                uScalingHeight: { value: 1.0 },
            },
            vertexShader: vertexShader(MAX_STATIONS),
            fragmentShader: fragmentShader,
        }),
        [MAX_STATIONS, degree, scaleMin, scaleMax],
    );

    const { particlePositions, particleCount } = useMemo(() => {
        const minParticles = 2;

        const list: Vector3[] = [];
        const count = new Vector3(
            (basePlateSize.x / particleSize) * particleFrequency,
            (height / particleSize) * particleFrequency,
            (basePlateSize.z / particleSize) * particleFrequency,
        );
        count.x = Math.max(Math.floor(count.x), minParticles);
        count.y = Math.max(Math.floor(count.y), minParticles);
        count.z = Math.max(Math.floor(count.z), minParticles);

        const delta = new Vector3(
            (basePlateSize.x - count.x * particleSize) / (count.x - 1),
            (height - count.y * particleSize) / (count.y - 1),
            (basePlateSize.z - count.z * particleSize) / (count.z - 1),
        );
        for (let x = 0; x < count.x; x += 1) {
            for (let y = 0; y < count.y; y += 1) {
                for (let z = 0; z < count.z; z += 1) {
                    list.push(
                        new Vector3(
                            -basePlateSize.x / 2 + x * (delta.x + particleSize) + particleSize / 2,
                            y * (delta.y + particleSize) + particleSize / 2,
                            -basePlateSize.z / 2 + z * (delta.z + particleSize) + particleSize / 2,
                        ),
                    );
                }
            }
        }

        return { particlePositions: list, particleCount: list.length };
    }, [basePlateSize, height, particleSize, particleFrequency]);

    const instanceMatrices = useMemo(() => {
        if (particleCount === 0) return new Float32Array(0);

        const array = new Float32Array(particleCount * 16);
        const obj = new Object3D();
        particlePositions.forEach((pos, i) => {
            obj.position.copy(pos);
            obj.updateMatrix();
            obj.matrix.toArray(array, i * 16);
        });
        return array;
    }, [particlePositions, particleCount]);

    const stationsData = useMemo(
        () => new Array(MAX_STATIONS).fill(null).map(() => new Vector4()),
        [MAX_STATIONS],
    );

    useFpsFrame(() => {
        if (!materialRef.current) return;

        const stations = Object.entries(getStationsData());

        let stationIndex = 0;
        let dataIndex = 0;

        while (stationIndex < stations.length) {
            const [name, data] = stations[stationIndex];
            const station = getStationByName(name);

            const pos = getMeshPosition(station?.id ?? '');
            const measurements = Object.values(data)[0];
            const value = measurements[measurements.length - 1].value;

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
        uniforms.uOpacity.value = particleOpacity;
        uniforms.uMinVal.value = scaleMin;
        uniforms.uMaxVal.value = scaleMax;
    }, settings.atmosphere.fps);

    return (
        <instancedMesh args={[undefined, undefined, particleCount]}>
            <instancedBufferAttribute attach='instanceMatrix' args={[instanceMatrices, 16]} />
            {particleForm === 'cube' && (
                <boxGeometry args={[particleSize, particleSize, particleSize]} />
            )}
            {particleForm === 'sphere' && (
                <sphereGeometry args={[particleSize / 2, particleSegments, particleSegments]} />
            )}
            <shaderMaterial ref={materialRef} args={[shader]} transparent />
        </instancedMesh>
    );
};
