import type { MastConfigFormData } from '@forms/mast-config-form/schema';
import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MastConfigSchema } from '@utils/schemas';

export const useCreateMastConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data }: { data: MastConfigFormData }) => {
            const response = await api.post<MastConfigSchema>(`/mast-configs`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mast-configs'] });
        },
    });
};
