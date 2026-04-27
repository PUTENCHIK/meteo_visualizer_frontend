import type { MeasureAliasFormData } from '@forms/measure-alias-form/schema';
import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MeasureAliasSchema } from '@utils/schemas';

export const useCreateMeasureAlias = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data }: { data: MeasureAliasFormData }) => {
            const response = await api.post<MeasureAliasSchema>(`/measure-aliases`, data);
            return response.data;
        },
        onSuccess: (createdAlias) => {
            queryClient.invalidateQueries({ queryKey: ['measures'] });
            queryClient.invalidateQueries({
                queryKey: ['measure', createdAlias.measure_id.toString()],
            });
        },
    });
};
