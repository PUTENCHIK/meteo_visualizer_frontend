import { Guid } from 'typescript-guid';
import {
    useSyncExternalStore,
    createContext,
    useContext,
    useMemo,
    useEffect,
    useState,
} from 'react';
import type { PollResult } from '@context/websocket-context';
import {
    measures,
    WeatherDevice,
    WeatherStation,
    type DeviceMeasurement,
    type VisualizationData,
} from '@utils/complexes';
import throttle from 'lodash.throttle';
import { useSettings } from '@context/use-settings';
import { useComplexStore } from '@stores/complex-store';
import { useShallow } from 'zustand/shallow';
import { storageManager } from '@managers/local-storage-manager';

type DevicesData = Record<string, WeatherDevice[]>;

class DevicesStore {
    private EMIT_FREQUENCY = 300;
    private _data: DevicesData = {};
    private _listeners = new Set<(data: DevicesData) => void>();
    private _measure: keyof typeof measures;

    constructor() {
        this._measure = storageManager.getItem('measure');
    }

    private _emitChange = () => {
        this._listeners.forEach((l) => l(this.data));
    };

    private throttledEmitChange = throttle(this._emitChange, this.EMIT_FREQUENCY);

    public addData = (name: string, pollResult: PollResult) => {
        const deviceName = WeatherDevice.parseName(name);
        if (!deviceName) {
            return;
        }

        const station = WeatherStation.getByDeviceName(deviceName);
        if (!station) {
            return;
        }

        const currentDevices = this.data[station.id.toString()] || [];

        this.data[station.id.toString()] = currentDevices.map((d) => d);

        const targetDeviceName = WeatherDevice.getNameFromParsed(deviceName);
        const devices = this._data[station.id.toString()];
        let device = devices.find((d) => d.fullName === targetDeviceName);
        if (!device) {
            device = new WeatherDevice(deviceName, station.id);
            this._data[station.id.toString()] = [...devices, device];
        }

        for (const payloadItem of pollResult.payload) {
            if (!device.data[payloadItem.name])
                device.data[payloadItem.name] = {
                    units: payloadItem.units,
                    measurements: [],
                };

            const measurements = device.data[payloadItem.name].measurements;
            device.data[payloadItem.name].measurements = [
                ...measurements,
                {
                    value: payloadItem.value,
                    timestamp: pollResult.timestamp,
                },
            ];

            if (device.data[payloadItem.name].measurements.length > 150) {
                device.data[payloadItem.name].measurements.shift();
            }
        }

        this._data = { ...this._data };

        this.throttledEmitChange();
    };

    public subscribe = (callback: (data: DevicesData) => void) => {
        this._listeners.add(callback);
        return () => this._listeners.delete(callback);
    };

    get data() {
        return this._data;
    }

    get measure() {
        return this._measure;
    }

    set measure(value: keyof typeof measures) {
        this._measure = value;
        storageManager.setItem('measure', value);
        this.throttledEmitChange();
    }

    public getAtmosphereData(): Record<string, VisualizationData> {
        const keys: readonly string[] = measures[this._measure];
        const positions = useComplexStore.getState().stationsPositions;
        const result: Record<string, VisualizationData> = {};

        for (const stationId in this._data) {
            const devices = this._data[stationId];
            const position = positions[stationId];
            if (!position) continue;

            for (const device of devices) {
                for (const measure in device.data) {
                    const measureData = device.data[measure];
                    if (keys.includes(measure)) {
                        const lastMeasurement = measureData.measurements.at(-1);
                        if (lastMeasurement) {
                            result[`${stationId}:${device.fullName}`] = {
                                position: position,
                                value: lastMeasurement.value,
                            };
                        }
                    }
                }
            }
        }

        return result;
    }

    public getChartData(deviceName: string, measure: string): DeviceMeasurement[] {
        for (const stationId in this._data) {
            const devices = this._data[stationId];
            for (const device of devices) {
                if (device.fullName === deviceName) {
                    for (const measureName in device.data) {
                        if (measureName === measure) {
                            const measure = device.data[measureName];
                            return measure.measurements;
                        }
                    }
                    return [];
                }
            }
        }
        return [];
    }
}

const devicesStore = new DevicesStore();

const DevicesContext = createContext<DevicesStore>(devicesStore);

export const DevicesProvider = ({ children }: { children: React.ReactNode }) => (
    <DevicesContext.Provider value={devicesStore}>{children}</DevicesContext.Provider>
);

export const useDevicesStore = () => {
    const context = useContext(DevicesContext);
    if (!context) throw new Error('useDevices must be used within DevicesProvider');
    return context;
};

const EMPTY_DEVICES: WeatherDevice[] = [];

export const useDevicesData = () => {
    const store = useDevicesStore();

    const data = useSyncExternalStore(
        (callback) => store.subscribe(callback),
        () => store.data,
    );

    return data;
};

export const useDeviceData = (stationId?: Guid) => {
    const store = useDevicesStore();

    const data = useSyncExternalStore(
        (callback) => store.subscribe(callback),
        () => {
            if (!stationId) return EMPTY_DEVICES;
            return store.data[stationId?.toString()] || EMPTY_DEVICES;
        },
    );

    return data;
};

export const useDevicesOfMast = (mastId: string | undefined) => {
    const stationIds = useComplexStore(
        useShallow((state) => {
            if (!mastId) return [];
            const mast = state.getMast(Guid.parse(mastId));

            return mast?.stations.map((s) => s.id.toString()) ?? [];
        }),
    );

    const allDevices = useDevicesData();

    return useMemo(() => {
        if (stationIds.length === 0) return [];
        return stationIds.flatMap((id) => allDevices[id] || []);
    }, [stationIds, allDevices]);
};

export const useMeasureScale = () => {
    const { map: settings } = useSettings();
    const store = useDevicesStore();

    const measure = useSyncExternalStore(
        (callback) => store.subscribe(callback),
        () => store.measure,
    );

    const scale = useMemo(() => {
        switch (measure) {
            case 'Температура':
                return {
                    min: settings.atmosphere.tempScale.min,
                    max: settings.atmosphere.tempScale.max,
                };
            case 'Влажность':
                return {
                    min: settings.atmosphere.humidityScale.min,
                    max: settings.atmosphere.humidityScale.max,
                };
            case 'Давление':
                return {
                    min: settings.atmosphere.pressureScale.min,
                    max: settings.atmosphere.pressureScale.max,
                };
            default:
                return { min: 0, max: 100 };
        }
    }, [
        measure,
        settings.atmosphere.tempScale.min,
        settings.atmosphere.tempScale.max,
        settings.atmosphere.humidityScale.min,
        settings.atmosphere.humidityScale.max,
        settings.atmosphere.pressureScale.min,
        settings.atmosphere.pressureScale.max,
    ]);

    return scale;
};

export const useChartData = (deviceName: string, measure: string) => {
    const store = useDevicesStore();
    const [data, setData] = useState(() => store.getChartData(deviceName, measure));

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const newData = store.getChartData(deviceName, measure);
            setData([...newData]);
        });

        return () => {
            unsubscribe();
        };
    }, [store, deviceName, measure]);

    return data;
};
