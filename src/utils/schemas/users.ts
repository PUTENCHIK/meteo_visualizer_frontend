import type { AuditableModelSchema } from './base';
import type { RoleSchema, RoleWithPermissionsSchema } from './roles-permissions';
import type { ComplexSchema } from './complexes';

export interface UserSchema extends AuditableModelSchema {
    login: string;
    lastname: string;
    firstname: string;
    secondname: string | null;
}

export interface UserWithRoleSchema extends UserSchema {
    role: RoleSchema;
}

export interface ActiveUserSchema extends UserWithRoleSchema {
    role: RoleWithPermissionsSchema;
    accessible_complexes: ComplexSchema[];
    favorite_complexes: ComplexSchema[];
    created_complexes: ComplexSchema[];
}
