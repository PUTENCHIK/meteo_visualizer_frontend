import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { MastConfigSchema } from '@utils/schemas';

export const useMastConfigs = () => {
    return useQuery({
        queryKey: ['mast-configs'],
        queryFn: async () => {
            const response = await api.get<MastConfigSchema[]>('/mast-configs');
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};
