import { useDialogs } from '@context/dialog-context';
import { BaseForm } from '@forms/base-form';
import { useCreateMeasure } from '@hooks/measures/use-create-measure';
import { useUpdateMeasure } from '@hooks/measures/use-update-measure';
import type { MeasureWithDependentsSchema } from '@utils/schemas';
import { measureSchema, type MeasureFormData } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@components/button';
import { InputLabel } from '@components/input-label';
import { TextInput } from '@components/text-input';
import { NumberInput } from '@components/number-input';

interface MeasureFormProps {
    measure?: MeasureWithDependentsSchema;
}

export const MeasureForm = ({ measure }: MeasureFormProps) => {
    const { closeDialog } = useDialogs();
    const createMutation = useCreateMeasure();
    const updateMutation = useUpdateMeasure();

    const isLoading = createMutation.isPending || updateMutation.isPending;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm<MeasureFormData>({
        resolver: zodResolver(measureSchema),
        mode: 'all',
        defaultValues: {
            name: measure?.name || '',
            min: measure?.min || 0,
            max: measure?.max || 0,
            units: measure?.units || '',
        },
    });

    const handleFormSubmit = async (data: MeasureFormData) => {
        if (measure) {
            await updateMutation.mutateAsync({ id: measure.id, data: data });
        } else {
            await createMutation.mutateAsync({ data });
        }
        closeDialog();
    };

    return (
        <BaseForm
            buttons={[
                <Button title='Сбросить' onClick={() => reset()} />,
                <Button
                    title={measure ? 'Сохранить' : 'Добавить'}
                    type='primary'
                    actionType='submit'
                    disabled={!isValid || isLoading || !isDirty}
                />,
            ]}
            onSubmit={handleSubmit(handleFormSubmit)}>
            <Controller
                name='name'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Наименование' required error={errors.name?.message}>
                        <TextInput {...field} placeholder='Температура' trim={false} />
                    </InputLabel>
                )}
            />
            <Controller
                name='min'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Минимум шкалы' required error={errors.min?.message}>
                        <NumberInput {...field} placeholder='-100' step={1} />
                    </InputLabel>
                )}
            />
            <Controller
                name='max'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Максимум шкалы' required error={errors.min?.message}>
                        <NumberInput {...field} placeholder='100' step={1} />
                    </InputLabel>
                )}
            />
            <Controller
                name='units'
                control={control}
                render={({ field }) => (
                    <InputLabel
                        label='Обозначение единиц измерения'
                        required
                        error={errors.units?.message}>
                        <TextInput {...field} placeholder='м/с' trim={false} />
                    </InputLabel>
                )}
            />
        </BaseForm>
    );
};
