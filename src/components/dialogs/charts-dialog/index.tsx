import clsx from 'clsx';
import s from './charts-dialog.module.scss';
import { LineChart } from '@components/line-chart';
import { useDevicesOfMast } from '@context/devices-data-context';
import { DialogWindow } from '@dialogs/dialog-window';
import { useMemo, useState } from 'react';
import { InputLabel } from '@components/input-label';
import { useComplexStore } from '@stores/complex-store';

export const ChartsDialog = () => {
    const masts = useComplexStore((state) => state.masts);
    const [currentMast, setCurrentMast] = useState<string | undefined>(undefined);

    const devices = useDevicesOfMast(currentMast);

    const [currentDevice, setCurrentDevice] = useState<string | undefined>(undefined);
    const [currentMeasure, setCurrentMeasure] = useState<string | undefined>(undefined);

    const deviceData = useMemo(() => {
        return devices.find((d) => d.fullName === currentDevice)?.data;
    }, [devices, currentDevice]);

    return (
        <DialogWindow
            dialogId='charts'
            title='График'
            widthLimits={{ min: 400, max: null }}
            heightLimits={{ min: 400 }}>
            {masts.length ? (
                <>
                    <div className={clsx(s['filters-box'])}>
                        <InputLabel label='Мачта'>
                            <select onChange={(event) => setCurrentMast(event.target.value)}>
                                <option value=''>-</option>
                                {masts.map((mast, index) => (
                                    <option key={index} value={mast.id.toString()}>
                                        {mast.prefix} ({mast.description})
                                    </option>
                                ))}
                            </select>
                        </InputLabel>
                        <InputLabel label='Девайс'>
                            <select onChange={(event) => setCurrentDevice(event.target.value)}>
                                {currentMast ? (
                                    <>
                                        <option value=''>-</option>
                                        {devices.map((device, index) => (
                                            <option key={index} value={device.fullName}>
                                                {device.fullName}
                                            </option>
                                        ))}
                                    </>
                                ) : (
                                    <option value=''>Выберите мачту</option>
                                )}
                            </select>
                        </InputLabel>
                        <InputLabel label='Параметр'>
                            <select onChange={(event) => setCurrentMeasure(event.target.value)}>
                                {deviceData && currentMast ? (
                                    <>
                                        <option value=''>-</option>
                                        {Object.keys(deviceData).map((measure, index) => (
                                            <option key={index} value={measure}>
                                                {measure}
                                            </option>
                                        ))}
                                    </>
                                ) : (
                                    <option value=''>Выберите девайс</option>
                                )}
                            </select>
                        </InputLabel>
                    </div>
                    {currentMast && currentDevice && currentMeasure ? (
                        <LineChart deviceName={currentDevice} measure={currentMeasure} />
                    ) : (
                        <span>Установите фильтры</span>
                    )}
                </>
            ) : (
                <span>Добавьте первую мачту</span>
            )}
        </DialogWindow>
    );
};
