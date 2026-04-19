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
    rotation: number;

    config: MastConfigSchema;
}

export interface ComplexSchema extends AuditableModelSchema {
    name: string;
    is_private: boolean;
    latitude: number | string;
    longitude: number | string;
    address: string | null;
    is_secreted: boolean;

    creator: UserSchema | null;
}

export interface ComplexWithMastsSchema extends ComplexSchema {
    masts: MastSchema[];
}

export interface ComplexFullSchema extends ComplexWithMastsSchema {
    secretkey: string | null;
}
