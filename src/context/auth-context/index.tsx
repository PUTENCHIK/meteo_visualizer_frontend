import { useEffect, useState } from 'react';
import { Loader } from '@components/loader';
import { useAuthStore } from '@stores/auth-store';
import api from '@stores/auth-store/api';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isChecking, setIsChecking] = useState(true);

    const { setAccessToken, fetchUser } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await api.post('/api/auth/refresh');
                setAccessToken(response.data.access_token);
                await fetchUser();
            } catch (e) {
                console.log(`Сессия не найдена или истекла: ${e}`);
            } finally {
                setIsChecking(false);
            }
        };
        initAuth();
    }, [setAccessToken, fetchUser]);

    if (isChecking) {
        return <Loader />;
    }

    return <>{children}</>;
};
