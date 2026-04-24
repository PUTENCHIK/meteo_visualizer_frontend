import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { UserWithRoleSchema } from '@utils/schemas';

export const useUsers = (includeDeleted: boolean) => {
    return useQuery({
        queryKey: ['users', includeDeleted],
        queryFn: async () => {
            const response = await api.get<UserWithRoleSchema[]>('/users', {
                params: { include_deleted: includeDeleted },
            });
            return response.data;
        },
    });
};
