import clsx from 'clsx';
import s from './weather-station-model.module.scss';
import { useComplexData } from '@context/complex-data-context';
import { useSettings } from '@context/use-settings';
import { SphereMesh } from '@models_/sphere-mesh';
import { Html } from '@react-three/drei';
import type { WeatherStationsNum } from '@utils/complexes';
import { useMemo, useState } from 'react';
import { Vector3 } from 'three';
import { GuidLabel } from '@components/guid-label';
import { IconButton } from '@components/icon-button';
import { useBridge } from '@context/bridge-context';
import { useFocus } from '@hooks/use-focus';
import { Button } from '@components/button';
import { useFpsFrame } from '@hooks/use-fps-frame';

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
    const { getStation, getStationsData, measure } = useComplexData();
    const { focusStation } = useFocus();
    const { Bridge } = useBridge();

    const [showInfo, setShowInfo] = useState(false);
    const [value, setValue] = useState<number | undefined>(0);

    const data = useMemo(() => {
        const data = getStation(mastId, yardHeight, num);
        if (data) {
            return data;
        } else {
            console.error(
                `Impossible to get weather station from ` +
                    `context: ${mastId}, ${yardHeight}, ${num}`,
            );
            return undefined;
        }
    }, [mastId, yardHeight, num, getStation]);

    useFpsFrame(() => {
        if (showInfo && data?.name) {
            const d = getStationsData();
            if (data.name in d) {
                const measurements = Object.values(d[data.name]);
                setValue(measurements[measurements.length - 1][0].value);
            } else {
                setValue(undefined);
            }
        }
    }, 10);

    const handleStationClick = () => {
        if (!showInfo && data) focusStation(data.id);
        setShowInfo((prev) => !prev);
    };

    return (
        <>
            {showInfo && (
                <Html
                    distanceFactor={12}
                    position={[position.x + 2 * (num === 1 ? -1 : 1), position.y - 0.5, position.z]}
                    center>
                    <Bridge>
                        <div className={clsx(s['info-box'])}>
                            {data && (
                                <>
                                    <div className={clsx(s['header'])}>
                                        <div className={clsx(s['item'])}>
                                            Станция
                                            <GuidLabel value={data.id} objct='station' />
                                        </div>
                                        <IconButton
                                            iconName='cross'
                                            title='Закрыть'
                                            iconSize={16}
                                            onClick={() => setShowInfo(false)}
                                        />
                                    </div>
                                    <div className={clsx(s['item'])}>
                                        Мачта
                                        <GuidLabel value={mastId} objct='mast' />
                                    </div>
                                    <span>Обозначение: {data.name ?? '-'}</span>
                                    {data.name && (
                                        <>
                                            <span>
                                                Значение ({measure}): {value?.toFixed(2) ?? '-'}
                                            </span>
                                            <Button title='График' type='primary' />
                                        </>
                                    )}
                                </>
                            )}
                            {!data && <span>Не удалось определить станцию</span>}
                        </div>
                    </Bridge>
                </Html>
            )}
            <SphereMesh
                name={data?.id}
                radius={settings.model.weatherStation.radius}
                position={position}
                color={settings.model.weatherStation.color}
                onClick={handleStationClick}
                onPointerOver={() => (document.body.style.cursor = 'pointer')}
                onPointerOut={() => (document.body.style.cursor = 'auto')}
            />
        </>
    );
};
