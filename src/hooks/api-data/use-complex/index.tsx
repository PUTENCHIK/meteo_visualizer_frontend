import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { ComplexWithSecretkeySchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useComplex = (complexId?: Guid) => {
    return useQuery({
        queryKey: ['complex', complexId],
        queryFn: async () => {
            if (!complexId) return undefined;
            const response = await api.get<ComplexWithSecretkeySchema>(`/complexes/${complexId}`);
            return response.data;
        },
        enabled: !!complexId,
    });
};
