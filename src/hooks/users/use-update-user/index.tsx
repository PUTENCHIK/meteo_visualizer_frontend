import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserWithRoleSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';
import type { UserFormData } from '@forms/user-form/schema';

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: Guid; data: UserFormData }) => {
            const response = await api.patch<UserWithRoleSchema>(`/users/${id}`, data);
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', id.toString()] });
        },
    });
};
