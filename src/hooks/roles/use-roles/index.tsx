import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { RoleWithPermissionsSchema } from '@utils/schemas';

export const useRoles = (includeDeleted: boolean = false) => {
    return useQuery({
        queryKey: ['roles', includeDeleted],
        queryFn: async () => {
            const response = await api.get<RoleWithPermissionsSchema[]>('/roles', {
                params: { include_deleted: includeDeleted },
            });
            return response.data;
        },
    });
};
