import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MastYardSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';
import type { MastYardFormData } from '@forms/mast-yard-form/schema';

export const useUpdateMastYard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: Guid; data: MastYardFormData }) => {
            const response = await api.patch<MastYardSchema>(`/mast-yards/${id}`, data);
            return response.data;
        },
        onSuccess: (updatedYard) => {
            queryClient.invalidateQueries({ queryKey: ['complex'] });
            queryClient.invalidateQueries({ queryKey: ['mast-configs'] });
            queryClient.invalidateQueries({
                queryKey: ['mast-config', updatedYard.config_id.toString()],
            });
            queryClient.invalidateQueries({ queryKey: ['mast-yard', updatedYard.id.toString()] });
        },
    });
};
