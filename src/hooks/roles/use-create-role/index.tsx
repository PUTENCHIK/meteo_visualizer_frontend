import type { RoleFormData } from '@forms/role-form/schema';
import api from '@stores/auth-store/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RoleSchema } from '@utils/schemas';

export const useCreateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data }: { data: RoleFormData }) => {
            const response = await api.post<RoleSchema>(`/roles`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    });
};
