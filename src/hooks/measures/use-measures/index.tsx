import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { MeasureWithDependentsSchema } from '@utils/schemas';

export const useMeasures = (includeDeleted: boolean = false) => {
    return useQuery({
        queryKey: ['measures', includeDeleted],
        queryFn: async () => {
            const response = await api.get<MeasureWithDependentsSchema[]>('/measures', {
                params: { include_deleted: includeDeleted },
            });
            return response.data;
        },
    });
};
