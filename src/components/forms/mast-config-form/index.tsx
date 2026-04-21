import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { BaseForm } from '@forms/base-form';
import { Button } from '@components/button';
import { InputLabel } from '@components/input-label';
import { TextInput } from '@components/text-input';
import type { MastConfigSchema } from '@utils/schemas';
import { useDialogs } from '@context/dialog-context';
import { NumberInput } from '@components/number-input';
import { useCreateMastConfig } from '@hooks/mast-configs/use-create-mast-config';
import { useUpdateMastConfig } from '@hooks/mast-configs/use-update-mast-config';
import { mastConfigSchema, type MastConfigFormData } from './schema';

interface MastConfigFormProps {
    config?: MastConfigSchema;
}

export const MastConfigForm = ({ config }: MastConfigFormProps) => {
    const { closeDialog } = useDialogs();
    const createMutation = useCreateMastConfig();
    const updateMutation = useUpdateMastConfig();

    const isLoading = createMutation.isPending || updateMutation.isPending;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm<MastConfigFormData>({
        resolver: zodResolver(mastConfigSchema),
        mode: 'all',
        defaultValues: {
            name: config?.name || '',
            height: config?.height || 0,
        },
    });

    const handleFormSubmit = async (data: MastConfigFormData) => {
        if (config) {
            await updateMutation.mutateAsync({ id: config.id, data: data });
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
                    title={config ? 'Сохранить' : 'Добавить'}
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
                    <InputLabel label='Название' required error={errors.name?.message}>
                        <TextInput {...field} placeholder='35 метров, 3 реи' trim={false} />
                    </InputLabel>
                )}
            />
            <Controller
                name='height'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Высота' required error={errors.height?.message}>
                        <NumberInput {...field} placeholder='35' postfix='м' />
                    </InputLabel>
                )}
            />
        </BaseForm>
    );
};
