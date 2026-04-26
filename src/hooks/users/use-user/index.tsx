import api from '@stores/auth-store/api';
import { useQuery } from '@tanstack/react-query';
import type { UserWithComplexesSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export const useUser = (userId?: Guid) => {
    return useQuery({
        queryKey: ['user', userId?.toString()],
        queryFn: async () => {
            if (!userId) return undefined;
            const response = await api.get<UserWithComplexesSchema>(
                `/users/${userId}`,
            );
            return response.data;
        },
        enabled: !!userId,
    });
};
