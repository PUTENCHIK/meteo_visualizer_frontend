import type { Guid } from 'typescript-guid';
import type { AuditableModelSchema } from './base';

export interface PermissionSchema extends AuditableModelSchema {
    name: string;
}

export interface RoleSchema extends AuditableModelSchema {
    name: string;
    parent_id: Guid | null;
    permissions: PermissionSchema[];
}

export interface RoleWithParentSchema extends RoleSchema {
    parent: RoleSchema | null;
    children: RoleSchema[];
}

export interface RoleWithPermissionsSchema extends RoleWithParentSchema {
    permissions: PermissionSchema[];
}
