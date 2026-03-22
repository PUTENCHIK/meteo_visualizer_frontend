import { MastConfig, Yard } from './classes';

export const measures = {
    Температура: ['AirTemperature', 'Temperature'],
    Влажность: ['Humidity'],
    Давление: ['Pressure'],
} as const satisfies Record<string, readonly string[]>;

export const mastConfigs = [
    new MastConfig('35m, 4 stations', 35, [
        new Yard(2, 1),
        new Yard(4, 1),
        new Yard(10, 1),
        new Yard(35, 1),
    ]),
    new MastConfig('35m, 8 stations', 35, [
        new Yard(2, 1),
        new Yard(4, 1),
        new Yard(10, 3),
        new Yard(35, 3),
    ]),
    new MastConfig('50m, 11 stations', 50, [
        new Yard(2, 1),
        new Yard(4, 1),
        new Yard(10, 3),
        new Yard(35, 3),
        new Yard(50, 3),
    ]),
] as const satisfies readonly MastConfig[];
