import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { MastConfigSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useMastConfig = (mastConfigId?: Guid) => {
    return useQuery({
        queryKey: ['mast-config', mastConfigId],
        queryFn: async () => {
            if (!mastConfigId) return undefined;
            const response = await api.get<MastConfigSchema>(`/mast-configs/${mastConfigId}`);
            return response.data;
        },
        enabled: !!mastConfigId,
    });
};
