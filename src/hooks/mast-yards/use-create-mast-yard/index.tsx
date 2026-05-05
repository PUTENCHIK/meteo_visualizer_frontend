import type { MastYardFormData } from '@forms/mast-yard-form/schema';
import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MastYardSchema } from '@utils/schemas';

export const useCreateMastYard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data }: { data: MastYardFormData }) => {
            const response = await api.post<MastYardSchema>(`/mast-yards`, data);
            return response.data;
        },
        onSuccess: (createdYard) => {
            queryClient.invalidateQueries({ queryKey: ['complex'] });
            queryClient.invalidateQueries({ queryKey: ['mast-configs'] });
            queryClient.invalidateQueries({
                queryKey: ['mast-config', createdYard.config_id.toString()],
            });
        },
    });
};
