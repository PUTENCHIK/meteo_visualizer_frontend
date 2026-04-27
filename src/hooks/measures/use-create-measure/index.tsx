import type { MeasureFormData } from '@forms/measure-form/schema';
import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MeasureWithDependentsSchema } from '@utils/schemas';

export const useCreateMeasure = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data }: { data: MeasureFormData }) => {
            const response = await api.post<MeasureWithDependentsSchema>(`/measures`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['measures'] });
        },
    });
};
