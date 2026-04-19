import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Guid } from 'typescript-guid';

export const useDeleteComplex = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, force }: { id: Guid; force: boolean }) => {
            const response = await api.delete<void>(`/complexes/${id}?force=${force}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complexes'] });
        },
    });
};
