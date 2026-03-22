import type { Vector3 } from 'three';

export interface GeographicSystemPosition {
    lat: Vector3;
    lon: Vector3;
}

export interface PolarPositionDto {
    radius: number;
    angle: number;
}
