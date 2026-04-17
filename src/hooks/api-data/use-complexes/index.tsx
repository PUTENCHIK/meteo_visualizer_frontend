import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { ComplexWithMastsSchema } from '@utils/schemas';

export const useComplexes = () => {
    return useQuery({
        queryKey: ['complexes'],
        queryFn: async () => {
            const response = await api.get<ComplexWithMastsSchema[]>('/complexes');
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};
