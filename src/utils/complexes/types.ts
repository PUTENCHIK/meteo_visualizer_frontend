import type { mastConfigs } from "./consts";
import type { StationMeasurement } from "./interfaces";

export type MastHeight = 35 | 50;

// Количество станций на одной рее
export type WeatherStationsAmount = 1 | 3;

// Номер станции в рамках одной реи
export type WeatherStationsNum = 1 | 2 | 3;

// {параметр атмосферы: замерение}
export type WeatherStationData = Record<string, StationMeasurement[]>;

export type MastConfigName = (typeof mastConfigs)[number]['name'];