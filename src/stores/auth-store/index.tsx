import type { ActiveUserSchema } from '@utils/http';
import { create } from 'zustand';
import api from './api';
import type { SigninFormData } from '@forms/signin-form/schema';
import type { SignupFormData } from '@forms/signup-form/schema';

interface AuthState {
    accessToken: string | null;
    user: ActiveUserSchema | null;
    isAuthenticated: boolean;
    setAccessToken: (token: string | null) => void;
    signin: (payload: SigninFormData) => Promise<void>;
    signup: (payload: SignupFormData) => Promise<void>;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    isAuthenticated: false,
    setAccessToken: (token) =>
        set({
            accessToken: token,
            isAuthenticated: !!token,
        }),
    signin: async (payload) => {
        const formData = new FormData();
        formData.append('username', payload.username);
        formData.append('password', payload.password);
        const response = await api.post('/auth/signin', formData);
        const token = response.data.access_token;

        set({ accessToken: token });

        await get().fetchUser();
    },
    signup: async (payload) => {
        const { passwordAgain: _, ...formData } = payload;
        const response = await api.post('/auth/signup', formData);
        const token = response.data.access_token;

        set({ accessToken: token });

        await get().fetchUser();
    },
    fetchUser: async () => {
        const response = await api.get<ActiveUserSchema>('/users/me');
        set({ user: response.data });
    },
    logout: async () => {
        await api.post('/auth/logout');
        set({
            accessToken: null,
            isAuthenticated: false,
        });
    },
}));
