import type { Vector4 } from '@react-three/fiber';
import type { IUniform, ShaderMaterialProperties } from 'three';

interface UniformsValue<T> {
    value: T;
}

export interface CustomUniforms {
    uStations: UniformsValue<Vector4[]>;
    uStationCount: UniformsValue<number>;
    uColors: UniformsValue<Vector4[]>;
    uColorCount: UniformsValue<number>;
    uDegree: UniformsValue<number>;
    uMinVal: UniformsValue<number>;
    uMaxVal: UniformsValue<number>;
    uOpacity: UniformsValue<number>;
    uScaling: UniformsValue<boolean>;
    uScalingHeight: UniformsValue<number>;
}

export type StrictUniforms = CustomUniforms & { [key: string]: IUniform<any> };

export interface ShaderData extends Partial<ShaderMaterialProperties> {
    uniforms: StrictUniforms;
    vertexShader: string;
    fragmentShader: string;
}
