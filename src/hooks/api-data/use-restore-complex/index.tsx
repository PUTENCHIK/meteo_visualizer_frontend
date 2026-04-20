import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ComplexWithMastsSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useRestoreComplex = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }: { id: Guid }) => {
            const response = await api.post<ComplexWithMastsSchema>(`/complexes/${id}`);
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['complexes'] });
            queryClient.invalidateQueries({ queryKey: ['complex', id] });
        },
    });
};
