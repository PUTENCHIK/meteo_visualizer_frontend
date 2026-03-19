import type { MastConfig } from "./interfaces";

export const mastConfigs = [
    {
        name: '35m, 4 stations',
        yards: [
            { amount: 1, height: 2 },
            { amount: 1, height: 4 },
            { amount: 1, height: 10 },
            { amount: 1, height: 35 },
        ],
        height: 35,
    },
    {
        name: '35m, 8 stations',
        yards: [
            { amount: 1, height: 2 },
            { amount: 1, height: 4 },
            { amount: 3, height: 10 },
            { amount: 3, height: 35 },
        ],
        height: 35,
    },
    {
        name: '50m, 11 stations',
        yards: [
            { amount: 1, height: 2 },
            { amount: 1, height: 4 },
            { amount: 3, height: 10 },
            { amount: 3, height: 35 },
            { amount: 3, height: 50 },
        ],
        height: 50,
    },
] as const satisfies readonly MastConfig[];

export const measures = {
    Температура: ['AirTemperature', 'Temperature'],
    Влажность: ['Humidity'],
    Давление: ['Pressure'],
} as const satisfies Record<string, readonly string[]>;