import { Button } from '@components/button';
import { BaseForm } from '@forms/base-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RoleSchema } from '@utils/schemas';
import { Controller, useForm } from 'react-hook-form';
import { useDialogs } from '@context/dialog-context';
import { InputLabel } from '@components/input-label';
import { Select } from '@components/select';
import { roleSchema, type RoleFormData } from './schema';
import { TextInput } from '@components/text-input';
import { useCreateRole } from '@hooks/roles/use-create-role';
import { useUpdateRole } from '@hooks/roles/use-update-role';

interface RoleFormProps {
    role?: RoleSchema;
    parentRoles: RoleSchema[];
}

export const RoleForm = ({ role, parentRoles }: RoleFormProps) => {
    const { closeDialog } = useDialogs();
    const createMutation = useCreateRole();
    const updateMutation = useUpdateRole();

    const isLoading = createMutation.isPending || updateMutation.isPending;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema),
        mode: 'all',
        defaultValues: {
            name: role?.name ?? '',
            parent_id: role?.parent_id,
        },
    });

    const handleFormSubmit = async (data: RoleFormData) => {
        if (role) {
            await updateMutation.mutateAsync({ id: role.id, data });
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
                    title={role ? 'Сохранить' : 'Добавить'}
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
                        <TextInput {...field} placeholder='Админ' />
                    </InputLabel>
                )}
            />
            <Controller
                name='parent_id'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Родительская роль' error={errors.parent_id?.message}>
                        <Select
                            {...field}
                            options={{
                                '': 'Нет родителя',
                                ...Object.fromEntries(
                                    parentRoles.map((r) => [r.id.toString(), r.name]),
                                ),
                            }}
                        />
                    </InputLabel>
                )}
            />
        </BaseForm>
    );
};
