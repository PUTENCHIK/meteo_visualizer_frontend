import { Button } from '@components/button';
import { InputLabel } from '@components/input-label';
import { TextInput } from '@components/text-input';
import { BaseForm } from '@forms/base-form';
import { useAuthStore } from '@stores/auth-store';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinSchema, type SigninFormData } from './schema';
import { useState } from 'react';

export const SigninForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const { signin } = useAuthStore();

    const [counter, setCounter] = useState(0);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<SigninFormData>({
        resolver: zodResolver(signinSchema),
        mode: 'onChange',
        defaultValues: { username: '', password: '' },
    });

    const handleFormSubmit = async (data: SigninFormData) => {
        await signin(data);
        navigate(from, { replace: true });
    };

    const handleReset = () => {
        reset();
        setCounter((prev) => prev + 1);
    };

    return (
        <BaseForm
            key={counter}
            buttons={[
                <Button title='Сбросить' onClick={handleReset} />,
                <Button title='Войти' type='primary' actionType='submit' disabled={!isValid} />,
            ]}
            onSubmit={handleSubmit(handleFormSubmit)}>
            <Controller
                name='username'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Логин' required error={errors.username?.message}>
                        <TextInput {...field} placeholder='username' />
                    </InputLabel>
                )}
            />
            <Controller
                name='password'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Пароль' required error={errors.password?.message}>
                        <TextInput {...field} placeholder='my-password' password />
                    </InputLabel>
                )}
            />
        </BaseForm>
    );
};
