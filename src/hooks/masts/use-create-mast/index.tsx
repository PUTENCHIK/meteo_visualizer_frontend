import type { MastFormData } from '@forms/mast-form/schema';
import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MastSchema } from '@utils/schemas';

export const useCreateMast = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data }: { data: MastFormData }) => {
            const response = await api.post<MastSchema>(`/masts`, data);
            return response.data;
        },
        onSuccess: (_, { data }) => {
            queryClient.invalidateQueries({ queryKey: ['complexes'] });
            queryClient.invalidateQueries({ queryKey: ['complex', data.complex_id.toString()] });
        },
    });
};
