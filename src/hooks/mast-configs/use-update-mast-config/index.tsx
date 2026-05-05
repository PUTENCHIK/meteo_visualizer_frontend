import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MastConfigSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';
import type { MastConfigFormData } from '@forms/mast-config-form/schema';

export const useUpdateMastConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: Guid; data: MastConfigFormData }) => {
            const response = await api.patch<MastConfigSchema>(`/mast-configs/${id}`, data);
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['complexes'] });
            queryClient.invalidateQueries({ queryKey: ['complex'] });
            queryClient.invalidateQueries({ queryKey: ['mast'] });
            queryClient.invalidateQueries({ queryKey: ['mast-configs'] });
            queryClient.invalidateQueries({ queryKey: ['mast-config', id.toString()] });
        },
    });
};
