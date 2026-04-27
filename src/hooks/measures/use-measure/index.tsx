import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { MeasureWithDependentsSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useMeasure = (measureId?: Guid) => {
    return useQuery({
        queryKey: ['measure', measureId],
        queryFn: async () => {
            if (!measureId) return undefined;
            const response = await api.get<MeasureWithDependentsSchema>(`/measures/${measureId}`);
            return response.data;
        },
        enabled: !!measureId,
    });
};
