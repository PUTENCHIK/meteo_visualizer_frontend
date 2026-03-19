import type { PolarSystemPosition } from "@utils/coordinate-systems";
import type { MastConfigName, MastHeight, WeatherStationsAmount, WeatherStationsNum } from "./types";

export interface WeatherStation {
    id: string;
    mastId: string;
    yardHeight: number;
    num: WeatherStationsNum;
    name?: string;
}

export interface StationMeasurement {
    value: number;
    timestamp: number;
}

export interface Yard {
    height: number;
    amount: WeatherStationsAmount;
}

export interface MastConfig {
    name: string;
    yards: Yard[];
    height: MastHeight;
}

export interface Mast {
    id: string;
    prefix: string;
    description?: string;
    position: PolarSystemPosition;
    rotation?: number;
    configName: MastConfigName;
}