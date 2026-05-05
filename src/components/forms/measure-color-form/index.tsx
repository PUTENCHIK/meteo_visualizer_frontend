import { useDialogs } from '@context/dialog-context';
import { BaseForm } from '@forms/base-form';
import type { MeasureColorSchema, MeasureWithDependentsSchema } from '@utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@components/button';
import { InputLabel } from '@components/input-label';
import { NumberInput } from '@components/number-input';
import { measureColorSchema, type MeasureColorFormData } from './schema';
import { useCreateMeasureColor } from '@hooks/measure-colors/use-create-measure-color';
import { useUpdateMeasureColor } from '@hooks/measure-colors/use-update-measure-color';
import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';

interface MeasureColorFormProps {
    measure: MeasureWithDependentsSchema;
    color?: MeasureColorSchema;
}

export const MeasureColorForm = ({ measure, color }: MeasureColorFormProps) => {
    const { closeDialog } = useDialogs();
    const createMutation = useCreateMeasureColor();
    const updateMutation = useUpdateMeasureColor();

    const isLoading = createMutation.isPending || updateMutation.isPending;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm<MeasureColorFormData>({
        resolver: zodResolver(measureColorSchema),
        mode: 'all',
        defaultValues: {
            measure_id: measure.id.toString(),
            value: color?.value || '',
            percent: (color?.percent || 0) * 100,
        },
    });

    const handleFormSubmit = async (data: MeasureColorFormData) => {
        if (color) {
            await updateMutation.mutateAsync({ id: color.id, data: data });
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
            <ComponentRowBox
                left={[<span>Параметр:</span>, <EntityLabel entity={measure} />]}
                size='tiny'
            />
            <Controller
                name='value'
                control={control}
                render={({ field }) => (
                    <InputLabel
                        label='Цвет'
                        required
                        error={errors.value?.message}
                        orientation='horizontal'>
                        <input type='color' {...field} />
                    </InputLabel>
                )}
            />
            <Controller
                name='percent'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Позиция' required error={errors.percent?.message}>
                        <NumberInput
                            {...field}
                            placeholder='50'
                            step={1}
                            min={0}
                            max={100}
                            maxLength={3}
                            postfix='%'
                            decimal={0}
                        />
                    </InputLabel>
                )}
            />
        </BaseForm>
    );
};
