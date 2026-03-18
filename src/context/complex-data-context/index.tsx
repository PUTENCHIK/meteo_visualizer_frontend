import { v5 as uuidv5 } from 'uuid';
import { Guid } from 'typescript-guid';
import { storageManager } from '@managers/local-storage-manager';
import {
    getMastConfig,
    measures,
    type Mast,
    type ScaleInterval,
    type WeatherStation,
    type WeatherStationData,
    type WeatherStationsNum,
} from '@utils/complexes';
import { type GeographicSystemPosition } from '@utils/coordinate-systems';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { Vector3 } from 'three';
import type { PollResult } from '@context/websocket-context';
import { useSettings } from '@context/use-settings';

const APP_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

interface ComplexDataContextType {
    position: GeographicSystemPosition;
    updatePosition: (lat: Vector3, lon: Vector3) => void;
    masts: Mast[];
    getMastById: (id: string) => Mast | undefined;
    addMast: () => void;
    updateMast: <K extends keyof Mast>(id: string, key: K, value: Mast[K]) => void;
    deleteMast: (id: string) => void;
    stations: WeatherStation[];
    getStation: (
        mastId: string,
        yardHeight: number,
        num: WeatherStationsNum,
    ) => WeatherStation | undefined;
    getStationByName: (name: string) => WeatherStation | undefined;
    getStationsData: () => Record<string, WeatherStationData>;
    updateStationData: (name: string, pollResult: PollResult) => void;
    measure: keyof typeof measures;
    updateMeasure: (value: keyof typeof measures) => void;
    getMeasureScale: () => ScaleInterval;
}

const ComplexDataContext = createContext<ComplexDataContextType | undefined>(undefined);

export const ComplexDataProvider = ({ children }: { children: ReactNode }) => {
    const { map: settings } = useSettings();

    // {Имя станции от API: данные станции}
    const stationsDataRef = useRef<Record<string, WeatherStationData>>({});
    const [position, setPosition] = useState<GeographicSystemPosition>(
        storageManager.getItem('position'),
    );
    const [masts, setMasts] = useState<Mast[]>(storageManager.getItem('masts'));
    const [measure, setMeasure] = useState<keyof typeof measures>(
        storageManager.getItem('measure'),
    );

    useEffect(() => {
        storageManager.setItem('masts', masts);
    }, [masts]);

    const stations = useMemo(() => {
        const getId = (mastId: string, yard: number, num: number) => {
            return uuidv5(`N${num}:${yard}m:${mastId}`, APP_NAMESPACE);
        };

        return masts.flatMap((mast) => {
            return getMastConfig(mast.configName).yards.flatMap((yard) => {
                const createStation = (num: WeatherStationsNum): WeatherStation => {
                    const id = getId(mast.id, yard.height, num);
                    return {
                        id,
                        mastId: mast.id,
                        yardHeight: yard.height,
                        num: num,
                    };
                };

                return yard.amount === 1
                    ? createStation(1)
                    : [createStation(1), createStation(2), createStation(3)];
            });
        });
    }, [masts]);

    const getStationsData = useCallback(() => {
        const data = stationsDataRef.current;
        const keys = measures[measure] as readonly string[];

        return Object.entries(data).reduce(
            (acc, [stationName, stationData]) => {
                const filteredData: WeatherStationData = {};
                let hasMatch = false;

                for (const key of keys) {
                    if (stationData[key] && stationData[key].length > 0) {
                        filteredData[key] = stationData[key];
                        hasMatch = true;
                        break;
                    }
                }

                if (hasMatch) {
                    acc[stationName] = filteredData;
                }

                return acc;
            },
            {} as Record<string, WeatherStationData>,
        );
    }, [measure]);

    const getStation = useCallback(
        (mastId: string, yardHeight: number, num: WeatherStationsNum) => {
            return stations.find(
                (s) => s.mastId === mastId && s.yardHeight === yardHeight && s.num === num,
            );
        },
        [stations],
    );

    const updateStationData = useCallback((name: string, pollResult: PollResult) => {
        const data = stationsDataRef.current;

        // Если имя станции отсутствует
        if (!data[name]) data[name] = {};

        for (const pollItem of pollResult.payload) {
            // Если отсутствует измерение в массиве у станции
            if (!data[name][pollItem.name]) data[name][pollItem.name] = [];

            const measurements = data[name][pollItem.name];

            measurements.push({
                value: pollItem.value,
                timestamp: pollResult.timestamp,
            });

            if (measurements.length > 30) {
                measurements.shift();
            }
        }
    }, []);

    const updatePosition = useCallback((lat: Vector3, lon: Vector3) => {
        const newPos: GeographicSystemPosition = { lat, lon };
        setPosition(newPos);
        storageManager.setItem('position', newPos);
    }, []);

    const getMastById = useCallback(
        (id: string) => {
            return masts.find((m) => m.id === id);
        },
        [masts],
    );

    const getStationByName = useCallback(
        (name: string) => {
            const parts = name.split('-');
            if (parts[parts.length - 1] === '01') parts.pop();

            // Префикс мачты, по которому она определяется
            const mastPrefix = parts[0].toLowerCase();
            let targetMast: Mast | undefined = undefined;
            for (const mast of masts) {
                if (mast.prefix.toLowerCase() === mastPrefix) {
                    targetMast = mast;
                    break;
                }
            }
            if (!targetMast) return undefined;
            const config = getMastConfig(targetMast.configName);

            // Обозначение высоты в формате L{h}, где h - это номер реи, начиная с основания мачты
            const yardLabel = parts[1];
            const yardNumber = Number(yardLabel[1]);

            if (yardNumber > config.yards.length) return undefined;
            const yard = config.yards[yardNumber - 1];

            // Номер станции на мачте
            let num: WeatherStationsNum;
            // Если в названии 3 части, значит обозначение номера нет в названии и станция только одна
            if (parts.length === 3) {
                num = 1;
                // Иначе, обозначение в формате N{1 | 2 | 3} передано
            } else {
                const numLabel = parts[2];
                const numNumber = Number(numLabel[1]);
                if (numNumber > yard.amount) return undefined;
                num = numNumber as WeatherStationsNum;
            }

            const station = getStation(targetMast.id, yard.height, num);
            if (station) {
                station.name = name;
            }

            return station;
        },
        [masts, getStation],
    );

    const addMast = useCallback(() => {
        setMasts((prev) => [
            ...prev,
            {
                id: Guid.create().toString(),
                prefix: '',
                description: '',
                configName: '35m, 4 stations',
                position: { radius: 0, angle: 0 },
                rotation: 0,
            },
        ]);
    }, []);

    const updateMast = useCallback(<K extends keyof Mast>(id: string, key: K, value: Mast[K]) => {
        setMasts((prev) => prev.map((mast) => (mast.id === id ? { ...mast, [key]: value } : mast)));
    }, []);

    const deleteMast = useCallback((id: string) => {
        setMasts((prev) => prev.filter((m) => m.id != id));
    }, []);

    const updateMeasure = useCallback((value: keyof typeof measures) => {
        setMeasure(value);
        storageManager.setItem('measure', value);
    }, []);

    const getMeasureScale = useCallback(() => {
        let scale: ScaleInterval;
        switch (measure) {
            case 'Температура':
                scale = {
                    min: settings.atmosphere.tempScale.min,
                    max: settings.atmosphere.tempScale.max,
                };
                break;
            case 'Влажность':
                scale = {
                    min: settings.atmosphere.humidityScale.min,
                    max: settings.atmosphere.humidityScale.max,
                };
                break;
            case 'Давление':
                scale = {
                    min: settings.atmosphere.pressureScale.min,
                    max: settings.atmosphere.pressureScale.max,
                };
                break;
            default:
                scale = { min: 0, max: 100 };
        }
        return scale;
    }, [
        measure,
        settings.atmosphere.tempScale.min,
        settings.atmosphere.tempScale.max,
        settings.atmosphere.humidityScale.min,
        settings.atmosphere.humidityScale.max,
        settings.atmosphere.pressureScale.min,
        settings.atmosphere.pressureScale.max,
    ]);

    const contextValue: ComplexDataContextType = {
        position: position,
        updatePosition: updatePosition,
        masts: masts,
        getMastById: getMastById,
        getStationByName: getStationByName,
        addMast: addMast,
        updateMast: updateMast,
        deleteMast: deleteMast,
        stations: stations,
        getStation: getStation,
        getStationsData: getStationsData,
        updateStationData: updateStationData,
        measure: measure,
        updateMeasure: updateMeasure,
        getMeasureScale: getMeasureScale,
    };

    return (
        <ComplexDataContext.Provider value={contextValue}>{children}</ComplexDataContext.Provider>
    );
};

export const useComplexData = () => {
    const context = useContext(ComplexDataContext);
    if (!context) throw new Error('useComplexData must be used within ComplexDataProvider');
    return context;
};
