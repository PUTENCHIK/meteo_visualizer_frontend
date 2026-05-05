import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MeasureAliasSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';
import type { MeasureAliasFormData } from '@forms/measure-alias-form/schema';

export const useUpdateMeasureAlias = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: Guid; data: MeasureAliasFormData }) => {
            const response = await api.patch<MeasureAliasSchema>(`/measure-aliases/${id}`, data);
            return response.data;
        },
        onSuccess: (updatedAlias) => {
            queryClient.invalidateQueries({ queryKey: ['measures'] });
            queryClient.invalidateQueries({
                queryKey: ['measure', updatedAlias.measure_id.toString()],
            });
            queryClient.invalidateQueries({
                queryKey: ['measure-alias', updatedAlias.id.toString()],
            });
        },
    });
};
