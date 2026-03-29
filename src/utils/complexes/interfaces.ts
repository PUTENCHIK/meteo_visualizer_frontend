import type { PolarPositionDto } from '@utils/coordinate-systems';
import type { WeatherStationsNum, MastConfigName } from './types';
import type { Vector3 } from 'three';

export interface DeviceMeasurement {
    value: number;
    timestamp: number;
}

export interface DeviceMeasure {
    units: string;
    measurements: DeviceMeasurement[];
}

export interface VisualizationData {
    position: Vector3;
    value: number;
}

export interface WeatherDeviceName {
    mast: string;
    yard: number;
    num: WeatherStationsNum;
    name: string;
    postfix?: string;
}

export interface GuidDto {
    value: string;
}

export interface MastDto {
    id: GuidDto;
    prefix: string;
    description: string;
    position: PolarPositionDto;
    rotation: number;
    _configName: MastConfigName;
}
