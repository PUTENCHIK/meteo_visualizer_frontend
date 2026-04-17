import type { AuditableModelSchema } from './base';
import type { RoleSchema, RoleWithPermissionsSchema } from './roles-permissions';
import type { ComplexSchema } from './complexes';

export interface UserSchema extends AuditableModelSchema {
    login: string;
    lastname: string;
    firstname: string;
    secondname: string;
    role: RoleSchema;
}

export interface ActiveUserSchema extends UserSchema {
    role: RoleWithPermissionsSchema;
    complexes: ComplexSchema[];
    created_complexes: ComplexSchema[];
}
