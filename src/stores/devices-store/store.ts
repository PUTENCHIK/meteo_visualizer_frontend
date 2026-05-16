import throttle from 'lodash.throttle';
import type { ComplexData, Measurement, VisualizationData, WeatherStationsPos } from './types';
import type { MessagePayloadSchema } from '@utils/schemas/websocket';
import { joinWithSeparator } from '@utils/common';
import { Guid } from 'typescript-guid';
import { v5 as uuidv5 } from 'uuid';
import { useComplexStore } from '@stores/complex-store';

export class DevicesStore {
    private EMIT_FREQUENCY = 300;
    private _data: ComplexData;
    private _stationPositions: Record<string, WeatherStationsPos>;
    private _listeners: Set<(data: ComplexData) => void>;

    static IDKEY = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

    constructor() {
        this._data = {};
        this._listeners = new Set();
        this._stationPositions = {};
    }

    private _emitChange = () => {
        this._listeners.forEach((l) => l(this._data));
    };

    private throttledEmitChange = throttle(this._emitChange, this.EMIT_FREQUENCY);

    public subscribe = (callback: (data: ComplexData) => void) => {
        this._listeners.add(callback);
        return () => this._listeners.delete(callback);
    };

    get data() {
        return this._data;
    }

    public clearData() {
        this._data = {};
    }

    public clearStore() {
        this.clearData();
        this._stationPositions = {};
    }

    public addData = (message: MessagePayloadSchema) => {
        const prefix = message.device_name.mast;
        const yardNum = message.device_name.yard;
        const num = message.device_name.num;
        const device = joinWithSeparator([message.device_name.name, message.device_name.postfix]);

        const masts = useComplexStore.getState().complex?.masts;
        if (!masts || masts.length === 0) return;
        const mast = masts.find((m) => m.prefix.toLowerCase() === prefix.toLowerCase());
        if (!mast) return;
        const mastId = mast.id.toString();
        const yard = mast.config?.yards.find((_, i) => i + 1 === yardNum);
        if (!yard) return;
        if (num > yard.amount) return;

        if (!(mastId in this._data)) {
            this._data[mastId] = {};
        }
        const stationId = DevicesStore.getStationId(mastId, yard.height, num);
        if (!(stationId.toString() in this._data[mastId])) {
            this._data[mastId][stationId.toString()] = {
                id: stationId,
                height: yard.height,
                num: num,
                devices: {},
            };
        }
        const station = this._data[mastId][stationId.toString()];
        if (!(device in station.devices)) {
            station.devices[device] = {
                data: [],
            };
        }

        const measurements = station.devices[device].data;
        for (const item of message.items) {
            let delta = 0;
            switch (prefix.toLowerCase()) {
                case "west":
                    delta = -10;
                    break;
                case "north":
                    delta = -15;
                    break;
                case "east":
                    delta = 5;
                    break;
                case "south":
                    delta = 10;
                    break;
            }
            station.devices[device].data = [
                ...measurements,
                {
                    value: item.value + delta * Math.random(),
                    timestamp: message.timestamp,
                },
            ];
        }
        if (measurements.length > 150) {
            station.devices[device].data.shift();
        }

        this._data = { ...this._data };

        this.throttledEmitChange();
    };

    public static getStationId(mastId: Guid | string, height: number, num: number): Guid {
        return Guid.parse(uuidv5(`${mastId}:${height}:${num}`, DevicesStore.IDKEY));
    }

    public setStationPosition(mastId: Guid, height: number, num: number, pos: WeatherStationsPos) {
        const stationsId = DevicesStore.getStationId(mastId, height, num);
        this._stationPositions[stationsId.toString()] = pos;
    }

    public getAtmosphereData(): Record<string, VisualizationData> {
        const result: Record<string, VisualizationData> = {};

        for (const mastId in this._data) {
            for (const stationId in this._data[mastId]) {
                const stationData = this._data[mastId][stationId];
                const pos = this._stationPositions[stationId];
                if (!pos) continue;
                for (const deviceName in stationData.devices) {
                    const device = stationData.devices[deviceName];
                    const lastMeasurement = device.data.at(-1);
                    if (lastMeasurement) {
                        result[`${stationId}-${deviceName}`] = {
                            value: lastMeasurement.value,
                            position: pos,
                        };
                    }
                }
            }
        }

        return result;
    }

    public getChartData(mastId: Guid, stationId: Guid, deviceId: string): Measurement[] {
        return (
            this._data[mastId.toString()]?.[stationId.toString()]?.devices[deviceId.toString()]
                ?.data ?? []
        );
    }
}

export const devicesStore = new DevicesStore();
