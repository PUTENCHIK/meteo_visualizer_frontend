import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { complexSchema, type ComplexFormData } from './schema';
import { BaseForm } from '@forms/base-form';
import { Button } from '@components/button';
import { InputLabel } from '@components/input-label';
import { TextInput } from '@components/text-input';
import type { ComplexWithSecretkeySchema } from '@utils/schemas';
import { useDialogs } from '@context/dialog-context';
import { useUpdateComplex } from '@hooks/api-data/use-update-complex';
import { NumberInput } from '@components/number-input';
import { useCreateComplex } from '@hooks/api-data/use-create-complex';

interface ComplexFormProps {
    complex?: ComplexWithSecretkeySchema;
}

export const ComplexForm = ({ complex }: ComplexFormProps) => {
    const { closeDialog } = useDialogs();
    const createMutation = useCreateComplex();
    const updateMutation = useUpdateComplex();

    const isLoading = createMutation.isPending || updateMutation.isPending;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm<ComplexFormData>({
        resolver: zodResolver(complexSchema),
        mode: 'all',
        defaultValues: {
            name: complex?.name ?? '',
            secretkey: complex?.secretkey ?? '',
            is_private: complex?.is_private ?? false,
            latitude: complex ? Number(complex.latitude) : 0,
            longitude: complex ? Number(complex.longitude) : 0,
            address: complex?.address ?? null,
        },
    });

    const handleFormSubmit = async (data: ComplexFormData) => {
        if (complex) {
            await updateMutation.mutateAsync({ id: complex.id, data: data });
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
                    title={complex ? 'Сохранить' : 'Добавить'}
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
                        <TextInput {...field} placeholder='Название комплекса' trim={false} />
                    </InputLabel>
                )}
            />
            <Controller
                name='latitude'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Широта' required error={errors.latitude?.message}>
                        <NumberInput {...field} />
                    </InputLabel>
                )}
            />
            <Controller
                name='longitude'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Долгота' required error={errors.longitude?.message}>
                        <NumberInput {...field} />
                    </InputLabel>
                )}
            />
            <Controller
                name='address'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Адрес TCP' error={errors.address?.message}>
                        <TextInput
                            {...field}
                            value={field.value ?? ''}
                            placeholder='tcp://127.0.0.1:8080'
                        />
                    </InputLabel>
                )}
            />
            <Controller
                name='is_private'
                control={control}
                render={({ field: { value, onChange } }) => (
                    <InputLabel label='Приватный' orientation='horizontal'>
                        <input
                            type='checkbox'
                            checked={value}
                            onChange={(e) => onChange(e.target.checked)}
                        />
                    </InputLabel>
                )}
            />
            <Controller
                name='secretkey'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Секретный ключ' error={errors.secretkey?.message}>
                        <TextInput
                            {...field}
                            value={field.value ?? ''}
                            placeholder='some-secret-key'
                            password
                        />
                    </InputLabel>
                )}
            />
        </BaseForm>
    );
};
