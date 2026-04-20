import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MastSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';
import type { MastFormData } from '@forms/mast-form/schema';

export const useUpdateMast = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: Guid; data: MastFormData }) => {
            const response = await api.patch<MastSchema>(`/masts/${id}`, data);
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['complexes'] });
            queryClient.invalidateQueries({ queryKey: ['mast', id] });
        },
    });
};
