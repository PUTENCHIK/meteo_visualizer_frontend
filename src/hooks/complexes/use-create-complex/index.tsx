import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ComplexFormData } from '@forms/complex-form/schema';
import type { ComplexWithMastsSchema } from '@utils/schemas';

export const useCreateComplex = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data }: { data: ComplexFormData }) => {
            const response = await api.post<ComplexWithMastsSchema>(`/complexes`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complexes'] });
        },
    });
};
