import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MeasureWithDependentsSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';
import type { MeasureFormData } from '@forms/measure-form/schema';

export const useUpdateMeasure = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: Guid; data: MeasureFormData }) => {
            const response = await api.patch<MeasureWithDependentsSchema>(`/measures/${id}`, data);
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['measures'] });
            queryClient.invalidateQueries({ queryKey: ['measure', id.toString()] });
        },
    });
};
