import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MeasureWithDependentsSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useRestoreMeasure = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id }: { id: Guid }) => {
            const response = await api.post<MeasureWithDependentsSchema>(`/measures/${id}`);
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['measures'] });
            queryClient.invalidateQueries({ queryKey: ['measure', id.toString()] });
        },
    });
};
