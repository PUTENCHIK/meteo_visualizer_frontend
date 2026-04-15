import type { Guid } from "typescript-guid";

export interface Permission {
    name: string
}

export interface Role {
    name: string;
    permissions: Permission[];
}

export interface Complex {
    name: string;
}

export interface User {
    id: Guid;
    login: string;
    lastname: string;
    firstname: string;
    secondname: string;
    role: Role;
    complexes: Complex[];
    created_complexes: Complex[];
}
