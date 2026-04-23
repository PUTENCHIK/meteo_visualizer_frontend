import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MastConfigSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useRestoreMastConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }: { id: Guid }) => {
            const response = await api.post<MastConfigSchema>(`/mast-configs/${id}`);
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['complexes'] });
            queryClient.invalidateQueries({ queryKey: ['mast-configs'] });
            queryClient.invalidateQueries({ queryKey: ['mast-config', id.toString()] });
        },
    });
};
