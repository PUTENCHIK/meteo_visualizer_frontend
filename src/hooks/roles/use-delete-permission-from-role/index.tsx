import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SystemPermission } from '@utils/http';
import type { DeletePermissionFromRoleSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useDeletePermissionFromRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            roleId,
            permission,
        }: {
            roleId: Guid;
            permission: SystemPermission;
        }) => {
            const data: DeletePermissionFromRoleSchema[] = [{ permission: permission }];
            const response = await api.delete<void>(`/roles/${roleId}/permissions`, { data: data });
            return response.data;
        },
        onSuccess: (_, { roleId }) => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            queryClient.invalidateQueries({ queryKey: ['role', roleId.toString()] });
            queryClient.invalidateQueries({
                queryKey: ['role', roleId.toString(), 'permissions'],
            });
        },
    });
};
