import type { AuditableModelSchema } from './base';
import type { UserSchema } from './users';

export interface MastYardSchema extends AuditableModelSchema {
    height: number;
    amount: number;
}

export interface MastConfigSchema extends AuditableModelSchema {
    name: string;
    height: number;
    yards: MastYardSchema[];
}

export interface MastSchema extends AuditableModelSchema {
    latitude: number;
    longitude: number;

    config: MastConfigSchema;
}

export interface ComplexSchema extends AuditableModelSchema {
    name: string;
    is_private: boolean;
    latitude: number;
    longitude: number;
    address: string | null;

    creator: UserSchema | null;
}

export interface ComplexWithMastsSchema extends ComplexSchema {
    masts: MastSchema[];
}
