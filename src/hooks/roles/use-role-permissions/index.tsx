import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { PermissionWithRoleInfoSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useRolePermissions = (roleId?: Guid) => {
    return useQuery({
        queryKey: ['role', roleId?.toString(), 'permissions'],
        queryFn: async () => {
            if (!roleId) return undefined;
            const response = await api.get<PermissionWithRoleInfoSchema[]>(
                `/roles/${roleId}/permissions`,
            );
            return response.data;
        },
        enabled: !!roleId,
    });
};
