import { Vector3 } from 'three';
import { degToRad, radToDeg } from 'three/src/math/MathUtils.js';
import type { GeographicSystemPosition } from './interfaces';

export const geographicToNumber = (coords: Vector3): number => {
    return coords.x + coords.y / 60 + coords.z / 3600;
};

export const getSunPosition = (
    position: GeographicSystemPosition,
    date?: Date,
): { azimuth: number; elevation: number } => {
    const lat = geographicToNumber(position.lat);
    const lon = geographicToNumber(position.lon);
    const now = date ?? new Date();

    // дата начала года
    const start = new Date(now.getUTCFullYear(), 0, 0);
    // кол-во миллисекунд от начала года
    const diff = now.getTime() - start.getTime();
    // номер дня
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // коэффициент для уравнения времени
    const b = degToRad((360 / 365) * (dayOfYear - 81));
    // склонение Солнца
    const delta = degToRad(23.44 * Math.sin(b));

    // уравнение времени в минутах
    const equationOfTime = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

    // часы UTC
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
    // истинное солнечное время
    const solarTime = utcHours + lon / 15 + equationOfTime / 60;

    // часовой угол
    const hourAngle = degToRad(15 * (solarTime - 12));

    // широта в радианах
    const latRad = degToRad(lat);

    // === //

    // высота Солнца
    const sinEl =
        Math.sin(latRad) * Math.sin(delta) +
        Math.cos(latRad) * Math.cos(delta) * Math.cos(hourAngle);
    const elevation = radToDeg(Math.asin(sinEl));

    // косинус азимута Солнца
    let cosAz =
        (Math.sin(delta) - Math.sin(degToRad(elevation)) * Math.sin(latRad)) /
        (Math.cos(degToRad(elevation)) * Math.cos(latRad));

    // acos [-1, 1]
    cosAz = Math.max(-1, Math.min(1, cosAz));
    // азимут Солнца
    let azimuth = radToDeg(Math.acos(cosAz));

    // корректировка азимута для времени после полудня
    if (hourAngle > 0) {
        azimuth = 360 - azimuth;
    }

    return { azimuth: Number(azimuth.toFixed(10)), elevation: Number(elevation.toFixed(10)) };
};

export const sunPosToLocal = (a: number, e: number, r: number): Vector3 => {
    const azRad = degToRad(a);
    const elRad = degToRad(e);

    return new Vector3(
        -r * Math.cos(elRad) * Math.sin(azRad),
        r * Math.sin(elRad),
        r * Math.cos(elRad) * Math.cos(azRad),
    );
};
