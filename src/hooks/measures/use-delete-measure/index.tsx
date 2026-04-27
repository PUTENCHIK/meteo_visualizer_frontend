import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Guid } from 'typescript-guid';

export const useDeleteMeasure = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, force }: { id: Guid; force: boolean }) => {
            const response = await api.delete<void>(`/measures/${id}`, {
                params: { force },
            });
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['measures'] });
            queryClient.invalidateQueries({ queryKey: ['measure', id.toString()] });
        },
    });
};
