import { useComplexData } from '@context/complex-data-context';
import { useSettings } from '@context/use-settings';
import { SphereMesh } from '@models_/sphere-mesh';
import type { WeatherStationsNum } from '@utils/complexes';
import { useMemo } from 'react';
import { Vector3 } from 'three';

interface WeatherStationModelProps {
    position: Vector3;
    mastId: string;
    yardHeight: number;
    num: WeatherStationsNum;
}

export const WeatherStationModel = ({
    position,
    mastId,
    yardHeight,
    num,
}: WeatherStationModelProps) => {
    const { map: settings } = useSettings();
    const { getStation } = useComplexData();

    const id = useMemo(() => {
        const data = getStation(mastId, yardHeight, num);
        if (data) {
            return data.id;
        } else {
            console.error(
                `Impossible to get weather station from ` +
                    `context: ${mastId}, ${yardHeight}, ${num}`,
            );
            return '';
        }
    }, [mastId, yardHeight, num, getStation]);

    return (
        <SphereMesh
            name={id}
            radius={settings.model.weatherStation.radius}
            position={position}
            color={settings.model.weatherStation.color}
        />
    );
};
