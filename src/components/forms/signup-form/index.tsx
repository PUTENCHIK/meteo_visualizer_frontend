import { Button } from '@components/button';
import { InputLabel } from '@components/input-label';
import { TextInput } from '@components/text-input';
import { BaseForm } from '@forms/base-form';
import { useEffect, useState } from 'react';

export const SignupForm = () => {
    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [secondname, setSecondname] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');

    const [passwordError, setPasswordError] = useState<string | undefined>(undefined);

    useEffect(() => {
        setPasswordError(password !== passwordAgain ? 'Пароль не совпадает' : undefined);
    }, [password, passwordAgain]);

    const handleResetButton = () => {
        setLastname('');
        setFirstname('');
        setSecondname('');
        setLogin('');
        setPassword('');
        setPasswordAgain('');
    };

    const handleSignupButton = () => {
        console.log('signup');
    };

    return (
        <BaseForm
            buttons={[
                <Button title='Сбросить' onClick={handleResetButton} />,
                <Button
                    title='Зарегистрироваться'
                    type='primary'
                    disabled={!!passwordError}
                    onClick={handleSignupButton}
                />,
            ]}>
            <InputLabel label='Фамилия' required>
                <TextInput
                    key={lastname}
                    defaultValue={lastname}
                    placeholder='Иванов'
                    onChange={setLastname}
                />
            </InputLabel>
            <InputLabel label='Имя' required>
                <TextInput
                    key={firstname}
                    defaultValue={firstname}
                    placeholder='Иван'
                    onChange={setFirstname}
                />
            </InputLabel>
            <InputLabel label='Отчество' required>
                <TextInput
                    key={secondname}
                    defaultValue={secondname}
                    placeholder='Иванович'
                    onChange={setSecondname}
                />
            </InputLabel>
            <InputLabel label='Логин' required>
                <TextInput
                    key={login}
                    defaultValue={login}
                    placeholder='username'
                    onChange={setLogin}
                />
            </InputLabel>
            <InputLabel label='Пароль' required>
                <TextInput
                    key={password}
                    defaultValue={password}
                    placeholder='my-password'
                    onChange={setPassword}
                />
            </InputLabel>
            <InputLabel label='Повторите пароль' error={passwordError} required>
                <TextInput
                    key={passwordAgain}
                    defaultValue={passwordAgain}
                    placeholder='my-password'
                    onChange={setPasswordAgain}
                />
            </InputLabel>
        </BaseForm>
    );
};
