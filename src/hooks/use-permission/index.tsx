import { useAuthStore } from '@stores/auth-store';
import type { SystemPermission } from '@utils/http';
import { useCallback, useMemo } from 'react';

export const usePermission = () => {
    const { user } = useAuthStore();

    const permissions = useMemo((): Set<SystemPermission> => {
        if (!user) return new Set();

        return new Set(user.role.permissions.map((p) => p.name as SystemPermission));
    }, [user]);

    const hasPermission = useCallback(
        (permission: SystemPermission): boolean => {
            return permissions.has(permission);
        },
        [permissions],
    );

    const hasAnyPermission = useCallback(
        (requiredPermissions: (SystemPermission | boolean)[]): boolean => {
            return requiredPermissions.some((perm) =>
                typeof perm === 'boolean' ? perm : permissions.has(perm),
            );
        },
        [permissions],
    );

    const hasAllPermissions = useCallback(
        (requiredPermissions: (SystemPermission | boolean)[]): boolean => {
            return requiredPermissions.every((perm) =>
                typeof perm === 'boolean' ? perm : permissions.has(perm),
            );
        },
        [permissions],
    );

    return { hasPermission, hasAnyPermission, hasAllPermissions };
};
