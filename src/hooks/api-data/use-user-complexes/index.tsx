import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { ComplexUserSchema } from '@utils/schemas';

export const useUserComplexes = () => {
    return useQuery({
        queryKey: ['user-complexes'],
        queryFn: async () => {
            const response = await api.get<ComplexUserSchema[]>('/users/me/complexes');
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};
