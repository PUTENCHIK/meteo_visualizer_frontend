import { useDialogs } from '@context/dialog-context';
import { BaseForm } from '@forms/base-form';
import type { MeasureAliasSchema, MeasureWithDependentsSchema } from '@utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@components/button';
import { InputLabel } from '@components/input-label';
import { TextInput } from '@components/text-input';
import { useCreateMeasureAlias } from '@hooks/measure-aliases/use-create-measure-alias';
import { useUpdateMeasureAlias } from '@hooks/measure-aliases/use-update-measure-alias';
import { measureAliasSchema, type MeasureAliasFormData } from './schema';
import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';

interface MeasureAliasFormProps {
    measure: MeasureWithDependentsSchema;
    alias?: MeasureAliasSchema;
}

export const MeasureAliasForm = ({ measure, alias }: MeasureAliasFormProps) => {
    const { closeDialog } = useDialogs();
    const createMutation = useCreateMeasureAlias();
    const updateMutation = useUpdateMeasureAlias();

    const isLoading = createMutation.isPending || updateMutation.isPending;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm<MeasureAliasFormData>({
        resolver: zodResolver(measureAliasSchema),
        mode: 'all',
        defaultValues: {
            measure_id: measure.id.toString(),
            name: alias?.name || '',
        },
    });

    const handleFormSubmit = async (data: MeasureAliasFormData) => {
        if (alias) {
            await updateMutation.mutateAsync({ id: alias.id, data: data });
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
                name='name'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Псевдоним' required error={errors.name?.message}>
                        <TextInput {...field} placeholder='temp' />
                    </InputLabel>
                )}
            />
        </BaseForm>
    );
};
