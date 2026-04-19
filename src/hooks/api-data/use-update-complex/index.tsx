import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ComplexFormData } from '@forms/complex-form/schema';
import type { ComplexWithMastsSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useUpdateComplex = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: Guid; data: ComplexFormData }) => {
            const response = await api.patch<ComplexWithMastsSchema>(`/complexes/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complexes'] });
            queryClient.invalidateQueries({ queryKey: ['complex'] });
        },
    });
};
