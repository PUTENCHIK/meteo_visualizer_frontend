import type { SystemPermission } from '@utils/http';
import type { AuditableModelSchema } from './base';

export interface AddPermissionToRoleSchema {
    permission: SystemPermission;
}

export interface DeletePermissionFromRoleSchema {
    permission: SystemPermission;
}

export interface PermissionSchema extends AuditableModelSchema {
    name: string;
    description: string;
}

export interface PermissionWithRoleInfoSchema extends PermissionSchema {
    is_relative: boolean;
}

export interface RoleSchema extends AuditableModelSchema {
    name: string;
    parent_id: string | null;
}

export interface RoleWithParentSchema extends RoleSchema {
    parent: RoleSchema | null;
    children: RoleSchema[];
}

export interface RoleWithPermissionsSchema extends RoleWithParentSchema {
    permissions: PermissionSchema[];
}
