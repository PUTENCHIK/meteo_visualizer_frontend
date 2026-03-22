import { useShallow } from 'zustand/shallow';
import { useComplexStore } from '.';
import type { Guid } from 'typescript-guid';
import { WeatherStation, type WeatherStationsNum } from '@utils/complexes';
import { useMemo } from 'react';

export const useStations = () => {
    return useComplexStore(useShallow((state) => state.masts.flatMap((mast) => mast.stations)));
};

export const useStationsMap = () => {
    const masts = useComplexStore((state) => state.masts);

    return useMemo(() => {
        const map = new Map<string, WeatherStation>();
        masts.forEach((mast) => {
            mast.stations.forEach((s) => {
                map.set(s.id.toString(), s);
            });
        });
        return map;
    }, [masts]);
};

export const useStation = (mastId: Guid, height: number, num: WeatherStationsNum) => {
    const map = useStationsMap();

    return useMemo(() => {
        const targetId = WeatherStation.generateId(mastId, height, num);
        return map.get(targetId.toString());
    }, [map, mastId, height, num]);
};
