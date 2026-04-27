import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { MeasureColorSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useMeasureColor = (colorId?: Guid) => {
    return useQuery({
        queryKey: ['measure-color', colorId],
        queryFn: async () => {
            if (!colorId) return undefined;
            const response = await api.get<MeasureColorSchema>(`/measure-colors/${colorId}`);
            return response.data;
        },
        enabled: !!colorId,
    });
};
