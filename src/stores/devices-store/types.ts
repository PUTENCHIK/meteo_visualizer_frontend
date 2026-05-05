import type { Guid } from 'typescript-guid';

export interface WeatherStationsPos {
    x: number;
    y: number;
    z: number;
}

export interface VisualizationData {
    position: WeatherStationsPos;
    value: number;
}

export interface Measurement {
    value: number;
    timestamp: number;
}

export interface WeatherDeviceData {
    data: Measurement[];
}

export interface WeatherStationData {
    id: Guid;
    height: number;
    num: number;
    devices: Record<string, WeatherDeviceData>;
}

export type MastData = Record<string, WeatherStationData>;

export type ComplexData = Record<string, MastData>;
