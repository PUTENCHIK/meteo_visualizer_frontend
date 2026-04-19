import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Guid } from 'typescript-guid';

export const useDeleteMast = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }: { id: Guid }) => {
            const response = await api.delete<void>(`/masts/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complexes'] });
        },
    });
};
