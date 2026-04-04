import clsx from 'clsx';
import s from './weather-stations-dialog.module.scss';
import sBoxes from '@styles/item-boxes.module.scss';
import { GuidLabel } from '@components/guid-label';
import { IconButton } from '@components/icon-button';
import { DialogWindow } from '@dialogs/dialog-window';
import { useFocus } from '@hooks/use-focus';
import { useStations } from '@stores/complex-store';
import { useDevicesData } from '@stores/devices-store';
import { measures } from '@utils/complexes';
import { InputLabel } from '@components/input-label';
import { Select } from '@components/select';
import { useDevicesStore } from '@context/devices-context';

export const WeatherStationsDialog = () => {
    const { focusStation } = useFocus();
    const store = useDevicesStore();
    const stations = useStations();
    const devices = useDevicesData();

    const handleMeasureSelectChange = (value: keyof typeof measures) => {
        store.measure = value;
    };

    return (
        <DialogWindow title='Метеостанции' dialogId='weatherStations'>
            <InputLabel label='Визуализируемый параметр'>
                <Select
                    defaultValue={store.measure}
                    options={Object.keys(measures).map((name) => name as keyof typeof measures)}
                    onChange={handleMeasureSelectChange}
                />
            </InputLabel>
            {stations.length === 0 && (
                <div className={clsx(sBoxes['empty-label-wrapper'])}>
                    <span className={clsx(sBoxes['empty-label'])}>Добавьте первую мачту</span>
                </div>
            )}
            {stations.map((station, sIndex) => (
                <div key={sIndex} className={clsx(s['station-item'])}>
                    <div className={clsx(sBoxes['header'])}>
                        <div className={clsx(sBoxes['group'])}>
                            <span className={clsx(sBoxes['number'])}>{sIndex + 1}. Станция</span>
                            <GuidLabel value={station.id} objct='station' />
                        </div>
                        <div className={clsx(sBoxes['group'])}>
                            <IconButton
                                iconName='eye'
                                title='Фокус'
                                iconSize={20}
                                onClick={() => focusStation(station.id)}
                            />
                        </div>
                    </div>
                    <div className={clsx(sBoxes['group'])}>
                        <span>Мачта:</span>
                        <GuidLabel value={station.mastId} objct='mast' />
                    </div>
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
        </DialogWindow>
    );
};
