import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { MastSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useMast = (mastId?: Guid) => {
    return useQuery({
        queryKey: ['mast', mastId],
        queryFn: async () => {
            if (!mastId) return undefined;
            const response = await api.get<MastSchema>(`/masts/${mastId}`);
            return response.data;
        },
        enabled: !!mastId,
    });
};
