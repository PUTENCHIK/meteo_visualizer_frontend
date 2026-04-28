import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SystemPermission } from '@utils/http';
import type { AddPermissionToRoleSchema } from '@utils/schemas';
import type { ComplexFavoriteSchema } from '@utils/schemas/complex-favorites';
import type { Guid } from 'typescript-guid';

export const useAddPermissionToRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            roleId,
            permission,
        }: {
            roleId: Guid;
            permission: SystemPermission;
        }) => {
            const data: AddPermissionToRoleSchema[] = [{ permission: permission }];
            const response = await api.post<ComplexFavoriteSchema>(
                `/roles/${roleId}/permissions`,
                data,
            );
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
