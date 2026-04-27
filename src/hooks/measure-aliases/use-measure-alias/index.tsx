import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { MeasureAliasSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useMeasureAlias = (aliasId?: Guid) => {
    return useQuery({
        queryKey: ['measure-alias', aliasId],
        queryFn: async () => {
            if (!aliasId) return undefined;
            const response = await api.get<MeasureAliasSchema>(`/measure-aliases/${aliasId}`);
            return response.data;
        },
        enabled: !!aliasId,
    });
};
