import { useSyncExternalStore } from 'react';
import { useDevicesStore } from '@context/devices-context';
import type { Guid } from 'typescript-guid';
import type { WeatherStationData } from './types';

export const useComplexData = () => {
    const store = useDevicesStore();

    const data = useSyncExternalStore(
        (callback) => store.subscribe(callback),
        () => store.data,
    );

    return data;
};

export const useStationData = (mastId: Guid, stationId: Guid): WeatherStationData | undefined => {
    const store = useDevicesStore();

    const data = useSyncExternalStore(
        (callback) => store.subscribe(callback),
        () => {
            return store.data[mastId.toString()]?.[stationId.toString()];
        },
    );

    return data;
};
