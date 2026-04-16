import type { Guid } from 'typescript-guid';

export interface AuditableModel {
    id: Guid;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface Permission extends AuditableModel {
    name: string;
}

export interface Role extends AuditableModel {
    name: string;
    permissions: Permission[];
}

export interface Complex extends AuditableModel {
    name: string;
}

export interface User extends AuditableModel {
    login: string;
    lastname: string;
    firstname: string;
    secondname: string;
    role: Role;
    complexes: Complex[];
    created_complexes: Complex[];
}
