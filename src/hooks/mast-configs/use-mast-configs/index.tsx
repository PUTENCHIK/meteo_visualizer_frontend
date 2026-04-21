import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { MastConfigSchema } from '@utils/schemas';

export const useMastConfigs = (includeDeleted: boolean = false) => {
    return useQuery({
        queryKey: ['mast-configs', includeDeleted],
        queryFn: async () => {
            const response = await api.get<MastConfigSchema[]>('/mast-configs', {
                params: { include_deleted: includeDeleted },
            });
            return response.data;
        },
    });
};
