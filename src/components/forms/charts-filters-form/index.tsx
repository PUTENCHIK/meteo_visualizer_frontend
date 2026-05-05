import { BaseForm } from '@forms/base-form';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { chartsFiltersSchema, type ChartsFiltersFormData } from './schema';
import { useEffect, useMemo } from 'react';
import { InputLabel } from '@components/input-label';
import { Select } from '@components/select';
import { DevicesStore, type ComplexData } from '@stores/devices-store';
import type { ComplexWithFavoriteInfoSchema } from '@utils/schemas';

interface ChartsFiltersFormProps {
    data: ComplexData;
    complex: ComplexWithFavoriteInfoSchema;
    onFiltersChange: (filters?: ChartsFiltersFormData) => void;
}

export const ChartsFiltersForm = ({ data, complex, onFiltersChange }: ChartsFiltersFormProps) => {
    const {
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ChartsFiltersFormData>({
        resolver: zodResolver(chartsFiltersSchema),
        mode: 'onChange',
        defaultValues: { mastId: '', stationId: '', deviceId: '' },
    });

    const selectedMastId = watch('mastId');
    const selectedStationId = watch('stationId');
    const selectedDeviceId = watch('deviceId');

    const stationsOfMast = useMemo(() => {
        const options: Record<string, string> = {};
        for (const mast of complex.masts) {
            if (mast.id.toString() === selectedMastId && mast.config?.yards) {
                for (const yard of mast.config.yards) {
                    for (let num = 1; num <= yard.amount; num++) {
                        const id = DevicesStore.getStationId(mast.id, yard.height, num);
                        options[id.toString()] = `${yard.height} м, #${num}`;
                    }
                }
            }
        }

        return options;
    }, [complex, selectedMastId]);

    const devicesOfStation: Record<string, string> = Object.fromEntries(
        Object.keys(data[selectedMastId]?.[selectedStationId]?.devices ?? {}).map((device) => [
            device,
            device,
        ]),
    );

    useEffect(() => {
        setValue('stationId', '');
    }, [setValue, selectedMastId]);
    useEffect(() => {
        setValue('deviceId', '');
    }, [setValue, selectedStationId]);
    useEffect(() => {
        onFiltersChange(watch());
    }, [selectedMastId, selectedStationId, selectedDeviceId, watch, onFiltersChange]);

    return (
        <BaseForm orientation='horizontal'>
            <Controller
                name='mastId'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Мачта' error={errors.mastId?.message}>
                        <Select
                            {...field}
                            options={{
                                '': 'Выберите мачту',
                                ...Object.fromEntries(
                                    complex.masts.map((mast) => [mast.id.toString(), mast.prefix]),
                                ),
                            }}
                        />
                    </InputLabel>
                )}
            />
            <Controller
                name='stationId'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Станция' error={errors.stationId?.message}>
                        <Select
                            {...field}
                            options={{
                                '':
                                    Object.keys(stationsOfMast).length > 0
                                        ? 'Выберите станцию'
                                        : 'Нет станций',
                                ...stationsOfMast,
                            }}
                            disabled={!selectedMastId}
                        />
                    </InputLabel>
                )}
            />
            <Controller
                name='deviceId'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Датчик' error={errors.deviceId?.message}>
                        <Select
                            {...field}
                            options={{
                                '':
                                    Object.keys(devicesOfStation).length > 0
                                        ? 'Выберите датчик'
                                        : 'Нет датчиков',
                                ...devicesOfStation,
                            }}
                            disabled={!selectedMastId || !selectedStationId}
                        />
                    </InputLabel>
                )}
            />
        </BaseForm>
    );
};
