import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MeasureColorSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';
import type { MeasureColorFormData } from '@forms/measure-color-form/schema';

export const useUpdateMeasureColor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: Guid; data: MeasureColorFormData }) => {
            const response = await api.patch<MeasureColorSchema>(`/measure-colors/${id}`, data);
            return response.data;
        },
        onSuccess: (updatedColor) => {
            queryClient.invalidateQueries({ queryKey: ['measures'] });
            queryClient.invalidateQueries({
                queryKey: ['measure', updatedColor.measure_id.toString()],
            });
            queryClient.invalidateQueries({
                queryKey: ['measure-color', updatedColor.id.toString()],
            });
        },
    });
};
