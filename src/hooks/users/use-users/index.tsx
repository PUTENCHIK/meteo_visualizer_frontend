import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { UserWithComplexesSchema } from '@utils/schemas';

export const useUsers = (includeDeleted: boolean) => {
    return useQuery({
        queryKey: ['users', includeDeleted],
        queryFn: async () => {
            const response = await api.get<UserWithComplexesSchema[]>('/users', {
                params: { include_deleted: includeDeleted },
            });
            return response.data;
        },
    });
};
