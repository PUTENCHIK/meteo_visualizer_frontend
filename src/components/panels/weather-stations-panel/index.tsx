import clsx from 'clsx';
import s from './weather-stations-panel.module.scss';
import { GuidLabel } from '@components/guid-label';
import { IconButton } from '@components/icon-button';
import { BasePanel } from '@panels/base-panel';
import { useFocus } from '@hooks/use-focus';
import { useStations } from '@stores/complex-store';
import { useDevicesData } from '@stores/devices-store';
import { measures } from '@utils/complexes';
import { InputLabel } from '@components/input-label';
import { Select } from '@components/select';
import { useDevicesStore } from '@context/devices-context';
import { ComponentRowBox } from '@components/component-row-box';

export const WeatherStationsPanel = () => {
    const { focusStation } = useFocus();
    const store = useDevicesStore();
    const stations = useStations();
    const devices = useDevicesData();

    const handleMeasureSelectChange = (value: keyof typeof measures) => {
        store.measure = value;
    };

    return (
        <BasePanel
            title='Метеостанции'
            panelId='weatherStations'
            widthLimits={{ min: 300 }}
            noContent={{
                cond: () => stations.length === 0,
                label: 'Добавьте первую мачту',
            }}>
            <InputLabel label='Визуализируемый параметр'>
                <Select
                    defaultValue={store.measure}
                    options={Object.keys(measures).map((name) => name as keyof typeof measures)}
                    onChange={handleMeasureSelectChange}
                />
            </InputLabel>
            {stations.map((station, sIndex) => (
                <div key={sIndex} className={clsx(s['station-item'])}>
                    <ComponentRowBox
                        left={[
                            <h3>{sIndex + 1}. Станция</h3>,
                            <GuidLabel value={station.id} objct='station' />,
                        ]}
                        right={[
                            <IconButton
                                iconName='eye'
                                title='Фокус'
                                iconSize={20}
                                onClick={() => focusStation(station.id)}
                            />,
                        ]}
                        size='tiny'
                    />
                    <ComponentRowBox
                        left={[
                            <span>Мачта:</span>,
                            <GuidLabel value={station.mastId} objct='mast' />,
                        ]}
                        size='tiny'
                    />
                    <span>
                        Высота: {station.height}м; Номер: {station.num}
                    </span>
                    {devices[station.id.toString()]?.length > 0 ? (
                        <>
                            <span>Датчики:</span>
                            <ol>
                                {devices[station.id.toString()].map((device, dIndex) => (
                                    <>
                                        <li key={dIndex}>{device.name}</li>
                                        <ul>
                                            {Object.entries(device.data).map(
                                                ([name, measure], mIndex) => (
                                                    <li key={mIndex}>
                                                        {name}:{' '}
                                                        {measure.measurements
                                                            .at(-1)
                                                            ?.value.toFixed(2)}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </>
                                ))}
                            </ol>
                        </>
                    ) : (
                        <span>Датчиков нет</span>
                    )}
                </div>
            ))}
        </BasePanel>
    );
};
