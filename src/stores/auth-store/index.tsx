import type { User } from '@utils/http';
import { create } from 'zustand';
import api from './api';

interface AuthState {
    accessToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    setAccessToken: (token: string | null) => void;
    signin: (formData: FormData) => Promise<void>;
    fetchUser: () => Promise<void>;
    logout: () => void;
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
    signin: async (formData) => {
        const response = await api.post('/api/auth/signin', formData);
        const token = response.data.access_token;
        
        set({ accessToken: token });
        
        await get().fetchUser();
    },
    fetchUser: async () => {
        const response = await api.get<User>('/api/users/me'); 
        set({ user: response.data });
    },
    logout: () => {
        set({
            accessToken: null,
            isAuthenticated: false,
        });
    },
}));
