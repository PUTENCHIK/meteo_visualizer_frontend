import clsx from 'clsx';
import s from './charts-panel.module.scss';
import { LineChart } from '@components/line-chart';
import { useDevicesOfMast } from '@stores/devices-store';
import { BasePanel } from '@panels/base-panel';
import { useMemo, useState } from 'react';
import { InputLabel } from '@components/input-label';
import { useComplexStore } from '@stores/complex-store';
import { Select } from '@components/select';

export const ChartsPanel = () => {
    const masts = useComplexStore((state) => state.masts);
    const [currentMast, setCurrentMast] = useState<string>('');

    const devices = useDevicesOfMast(currentMast);

    const [currentDevice, setCurrentDevice] = useState<string>('');
    const [currentMeasure, setCurrentMeasure] = useState<string>('');

    const deviceData = useMemo(() => {
        return devices.find((d) => d.fullName === currentDevice)?.data;
    }, [devices, currentDevice]);

    const handleMastChange = (value: string) => {
        setCurrentMast(value);
        setCurrentDevice('');
        setCurrentMeasure('');
    };

    const handleDeviceChange = (value: string) => {
        setCurrentDevice(value);
        setCurrentMeasure('');
    };

    const handleMeasureChange = (value: string) => {
        setCurrentMeasure(value);
    };

    return (
        <BasePanel
            panelId='charts'
            title='График'
            widthLimits={{ min: 400, max: null }}
            heightLimits={{ min: 400 }}>
            {masts.length ? (
                <>
                    <div className={clsx(s['filters-box'])}>
                        <InputLabel label='Мачта'>
                            <Select
                                options={['', ...masts.map((mast) => mast.id.toString())]}
                                labels={{
                                    '': '-',
                                    ...masts.reduce(
                                        (acc, mast) => {
                                            acc[mast.id.toString()] = [
                                                mast.prefix,
                                                mast.description && `(${mast.description})`,
                                            ].join(' ');
                                            return acc;
                                        },
                                        {} as Record<string, string>,
                                    ),
                                }}
                                onChange={handleMastChange}
                            />
                        </InputLabel>
                        <InputLabel label='Датчик'>
                            <Select
                                options={
                                    currentMast
                                        ? ['', ...devices.map((device) => device.fullName)]
                                        : ['Выберите мачту']
                                }
                                labels={{ '': '-' }}
                                onChange={handleDeviceChange}
                            />
                        </InputLabel>
                        <InputLabel label='Параметр'>
                            <Select
                                options={
                                    deviceData && currentMast && currentDevice
                                        ? ['', ...Object.keys(deviceData).map((measure) => measure)]
                                        : ['Выберите датчик']
                                }
                                labels={{ '': '-' }}
                                onChange={handleMeasureChange}
                            />
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
        </BasePanel>
    );
};
