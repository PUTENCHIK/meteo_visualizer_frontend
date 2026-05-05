import { Button } from '@components/button';
import { InputLabel } from '@components/input-label';
import { TextInput } from '@components/text-input';
import { BaseForm } from '@forms/base-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { userSchema, type UserFormData } from './schema';
import type { UserSchema } from '@utils/schemas';
import { useDialogs } from '@context/dialog-context';
import { useUpdateUser } from '@hooks/users/use-update-user';

interface UserFormProps {
    user?: UserSchema;
}

export const UserForm = ({ user }: UserFormProps) => {
    const { closeDialog } = useDialogs();
    const updateMutation = useUpdateUser();

    const isLoading = updateMutation.isPending;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isDirty },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        mode: 'onChange',
        defaultValues: {
            lastname: user?.lastname ?? '',
            firstname: user?.firstname ?? '',
            secondname: user?.secondname ?? '',
        },
    });

    const handleFormSubmit = async (data: UserFormData) => {
        if (user) {
            await updateMutation.mutateAsync({ id: user.id, data: data });
        }
        closeDialog();
    };

    return (
        <BaseForm
            buttons={[
                <Button title='Сбросить' onClick={() => reset()} />,
                <Button
                    title={user ? 'Сохранить' : 'Добавить'}
                    type='primary'
                    actionType='submit'
                    disabled={!isValid || isLoading || !isDirty}
                />,
            ]}
            onSubmit={handleSubmit(handleFormSubmit)}>
            <Controller
                name='lastname'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Фамилия' required error={errors.lastname?.message}>
                        <TextInput {...field} placeholder='Иванов' />
                    </InputLabel>
                )}
            />
            <Controller
                name='firstname'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Имя' required error={errors.firstname?.message}>
                        <TextInput {...field} placeholder='Иван' />
                    </InputLabel>
                )}
            />
            <Controller
                name='secondname'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Отчество' error={errors.secondname?.message}>
                        <TextInput {...field} placeholder='Иванович' />
                    </InputLabel>
                )}
            />
        </BaseForm>
    );
};
