import type { MeasureColorFormData } from '@forms/measure-color-form/schema';
import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MeasureColorSchema } from '@utils/schemas';

export const useCreateMeasureColor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data }: { data: MeasureColorFormData }) => {
            const response = await api.post<MeasureColorSchema>(`/measure-colors`, data);
            return response.data;
        },
        onSuccess: (createdColor) => {
            queryClient.invalidateQueries({ queryKey: ['measures'] });
            queryClient.invalidateQueries({
                queryKey: ['measure', createdColor.measure_id.toString()],
            });
        },
    });
};
