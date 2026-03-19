import type { Vector3 } from "three";

export interface PolarSystemPosition {
    radius: number;
    angle: number;
}

export interface GeographicSystemPosition {
    lat: Vector3;
    lon: Vector3;
}