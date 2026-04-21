import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Guid } from 'typescript-guid';

export const useDeleteComplexFromFavorites = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ complexId }: { complexId: Guid }) => {
            const response = await api.delete<void>(`/complexes/${complexId}/favorite`);
            return response.data;
        },
        onSuccess: (_, { complexId }) => {
            queryClient.invalidateQueries({ queryKey: ['complexes'] });
            queryClient.invalidateQueries({ queryKey: ['complex', complexId] });
        },
    });
};
