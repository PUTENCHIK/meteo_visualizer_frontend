import { Guid } from 'typescript-guid';
import { useShallow } from 'zustand/shallow';
import { useSyncExternalStore, useMemo, useState, useEffect } from 'react';
import { useDevicesStore } from '@context/devices-context';
import { useSettings } from '@context/use-settings';
import { useComplexStore } from '@stores/complex-store';
import type { WeatherDevice } from '@utils/complexes';

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
