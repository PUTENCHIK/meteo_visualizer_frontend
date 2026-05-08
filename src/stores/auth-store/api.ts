import axios, { AxiosError } from 'axios';
import { useAuthStore } from '.';
import type { ApiErrorResponse } from '@utils/http';
import { showError } from '@components/toast/funcs';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config;

        const errorData = error.response?.data;

        if (errorData) {
            const { code } = errorData.detail;

            if (code === 'TOKEN_EXPIRED' && originalRequest && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const res = await api.post('/auth/refresh', {}, { withCredentials: true });
                    const { access_token } = res.data;

                    useAuthStore.getState().setAccessToken(access_token);
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    await useAuthStore.getState().logout();
                    window.location.href = '/auth';
                    return Promise.reject(refreshError);
                }
            }
            showError({ error: errorData, statusCode: error.response?.status });
        }

        return Promise.reject(error);
    },
);

export default api;
