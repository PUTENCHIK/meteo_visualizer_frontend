import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RoleSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';
import type { RoleFormData } from '@forms/role-form/schema';

export const useUpdateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: Guid; data: RoleFormData }) => {
            const response = await api.patch<RoleSchema>(`/roles/${id}`, data);
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            queryClient.invalidateQueries({ queryKey: ['role', id.toString()] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};
