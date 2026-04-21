import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { ComplexWithFavoriteInfoSchema } from '@utils/schemas';

export const useComplexes = (includeDeleted: boolean) => {
    return useQuery({
        queryKey: ['complexes', includeDeleted],
        queryFn: async () => {
            const response = await api.get<ComplexWithFavoriteInfoSchema[]>('/complexes', {
                params: { include_deleted: includeDeleted },
            });
            return response.data;
        },
    });
};
