import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ComplexFavoriteSchema } from '@utils/schemas/complex-favorites';
import type { Guid } from 'typescript-guid';

export const useAddComplexToFavorites = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ complexId }: { complexId: Guid }) => {
            const response = await api.post<ComplexFavoriteSchema>(
                `/complexes/${complexId}/favorite`,
            );
            return response.data;
        },
        onSuccess: (_, { complexId }) => {
            queryClient.invalidateQueries({ queryKey: ['complexes'] });
            queryClient.invalidateQueries({ queryKey: ['complex', complexId.toString()] });
        },
    });
};
