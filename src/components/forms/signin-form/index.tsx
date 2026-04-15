import { Button } from '@components/button';
import { InputLabel } from '@components/input-label';
import { TextInput } from '@components/text-input';
import { BaseForm } from '@forms/base-form';
import { useAuthStore } from '@stores/auth-store';
import api from '@stores/auth-store/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SigninForm = () => {
    const navigate  = useNavigate()

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const setAccessToken = useAuthStore(state => state.setAccessToken);

    const handleResetButton = () => {
        setLogin('');
        setPassword('');
    };

    const handleLogin = async () => {
        try {
            const formData = new FormData();
            formData.append('username', login);
            formData.append('password', password);

            const response = await api.post('/api/auth/signin', formData);
            
            setAccessToken(response.data.access_token);
            
            navigate('/');
        } catch (error) {
            throw error;
        }
    };

    return (
        <BaseForm
            buttons={[
                <Button title='Сбросить' onClick={handleResetButton} />,
                <Button title='Войти' type='primary' actionType='submit' />,
            ]}
            onSubmit={handleLogin}>
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
        </BaseForm>
    );
};
