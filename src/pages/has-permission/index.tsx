import React from 'react';
import { usePermission } from '@hooks/use-permission';
import type { SystemPermission } from '@utils/http';

interface HasPermissionProps {
    children: React.ReactNode;
    permission?: SystemPermission;
    anyOf?: SystemPermission[];
    allOf?: SystemPermission[];
    fallback?: React.ReactNode;
}

export const HasPermission = ({
    children,
    permission,
    anyOf,
    allOf,
    fallback = null,
}: HasPermissionProps) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

    let isAllowed = false;

    if (permission) {
        isAllowed = hasPermission(permission);
    } else if (anyOf) {
        isAllowed = hasAnyPermission(anyOf);
    } else if (allOf) {
        isAllowed = hasAllPermissions(allOf);
    }

    return isAllowed ? <>{children}</> : <>{fallback}</>;
};
