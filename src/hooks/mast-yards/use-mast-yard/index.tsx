import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { MastYardSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useMastYard = (mastYardId?: Guid) => {
    return useQuery({
        queryKey: ['mast-yard', mastYardId],
        queryFn: async () => {
            if (!mastYardId) return undefined;
            const response = await api.get<MastYardSchema>(`/mast-yards/${mastYardId}`);
            return response.data;
        },
        enabled: !!mastYardId,
    });
};
