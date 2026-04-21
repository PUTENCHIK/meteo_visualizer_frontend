import { Button } from '@components/button';
import { BaseForm } from '@forms/base-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MastConfigSchema, MastYardSchema } from '@utils/schemas';
import { Controller, useForm } from 'react-hook-form';
import { useDialogs } from '@context/dialog-context';
import { InputLabel } from '@components/input-label';
import { NumberInput } from '@components/number-input';
import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { useCreateMastYard } from '@hooks/mast-yards/use-create-mast-yard';
import { useUpdateMastYard } from '@hooks/mast-yards/use-update-mast-yard';
import { mastYardSchema, type MastYardFormData } from './schema';

interface MastYardFormProps {
    config: MastConfigSchema;
    yard?: MastYardSchema;
}

export const MastYardForm = ({ config, yard }: MastYardFormProps) => {
    const { closeDialog } = useDialogs();
    const createMutation = useCreateMastYard();
    const updateMutation = useUpdateMastYard();

    const isLoading = createMutation.isPending || updateMutation.isPending;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm<MastYardFormData>({
        resolver: zodResolver(mastYardSchema),
        mode: 'all',
        defaultValues: {
            config_id: config.id.toString(),
            height: yard?.height ?? 0,
            amount: yard?.amount ?? 0,
        },
    });

    const handleFormSubmit = async (data: MastYardFormData) => {
        if (yard) {
            await updateMutation.mutateAsync({ id: yard.id, data });
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
                    title={yard ? 'Сохранить' : 'Добавить'}
                    type='primary'
                    actionType='submit'
                    disabled={!isValid || isLoading || !isDirty}
                />,
            ]}
            onSubmit={handleSubmit(handleFormSubmit)}>
            <ComponentRowBox
                left={[<span>Конфиг мачты:</span>, <EntityLabel entity={config} />]}
                size='tiny'
            />
            <Controller
                name='height'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Высота' required error={errors.height?.message}>
                        <NumberInput {...field} postfix='м' />
                    </InputLabel>
                )}
            />
            <Controller
                name='amount'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Количество станций' required error={errors.amount?.message}>
                        <NumberInput {...field} postfix='станций' />
                    </InputLabel>
                )}
            />
        </BaseForm>
    );
};
