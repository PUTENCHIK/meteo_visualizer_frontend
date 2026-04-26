import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { RoleWithPermissionsSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useRole = (roleId?: Guid) => {
    return useQuery({
        queryKey: ['role', roleId?.toString()],
        queryFn: async () => {
            if (!roleId) return undefined;
            const response = await api.get<RoleWithPermissionsSchema>(
                `/roles/${roleId}`,
            );
            return response.data;
        },
        enabled: !!roleId,
    });
};
