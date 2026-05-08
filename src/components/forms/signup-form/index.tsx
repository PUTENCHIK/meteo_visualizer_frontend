import { Button } from '@components/button';
import { InputLabel } from '@components/input-label';
import { TextInput } from '@components/text-input';
import { BaseForm } from '@forms/base-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { signupSchema, type SignupFormData } from './schema';
import { useAuthStore } from '@stores/auth-store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const SignupForm = () => {
    const navigate = useNavigate();
    const { signup } = useAuthStore();

    const [counter, setCounter] = useState(0);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
        defaultValues: {
            lastname: '',
            firstname: '',
            secondname: '',
            login: '',
            password: '',
            passwordAgain: '',
        },
    });

    const handleFormSubmit = async (data: SignupFormData) => {
        await signup(data);
        navigate('/');
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
                <Button
                    title='Зарегистрироваться'
                    type='primary'
                    actionType='submit'
                    disabled={!isValid}
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
            <Controller
                name='login'
                control={control}
                render={({ field }) => (
                    <InputLabel label='Логин' required error={errors.login?.message}>
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
            <Controller
                name='passwordAgain'
                control={control}
                render={({ field }) => (
                    <InputLabel
                        label='Повторите пароль'
                        required
                        error={errors.passwordAgain?.message}>
                        <TextInput {...field} placeholder='my-password' password />
                    </InputLabel>
                )}
            />
        </BaseForm>
    );
};
