import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { ComplexAccessSchema } from '@utils/schemas';

export const useUserComplexes = () => {
    return useQuery({
        queryKey: ['user-complexes'],
        queryFn: async () => {
            const response = await api.get<ComplexAccessSchema[]>('/users/me/complexes');
            return response.data;
        },
    });
};
