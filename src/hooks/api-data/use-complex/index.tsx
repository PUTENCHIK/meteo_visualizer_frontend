import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { ComplexWithMastsSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useComplex = (complexId?: Guid) => {
    return useQuery({
        queryKey: ['complex', complexId],
        queryFn: async () => {
            if (!complexId) return undefined;
            const response = await api.get<ComplexWithMastsSchema>(`/complexes/${complexId}`);
            return response.data;
        },
        enabled: !!complexId,
        staleTime: 5 * 60 * 1000,
    });
};
