import type { AuditableModelSchema } from './base';

export interface PermissionSchema extends AuditableModelSchema {
    name: string;
    description: string;
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
