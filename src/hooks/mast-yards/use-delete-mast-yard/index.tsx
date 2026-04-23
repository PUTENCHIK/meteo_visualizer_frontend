import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Guid } from 'typescript-guid';

export const useDeleteMastYard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }: { id: Guid }) => {
            const response = await api.delete<void>(`/mast-yards/${id}`);
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['complex'] });
            queryClient.invalidateQueries({ queryKey: ['mast-configs'] });
            queryClient.invalidateQueries({ queryKey: ['mast-config'] });
            queryClient.invalidateQueries({ queryKey: ['mast-yard', id.toString()] });
        },
    });
};
