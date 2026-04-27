import type { Guid } from 'typescript-guid';
import type { AuditableModelSchema } from './base';
import type { UserWithRoleSchema } from './users';

export interface MastYardSchema extends AuditableModelSchema {
    height: number;
    amount: number;
    config_id: Guid;
}

export interface MastConfigSchema extends AuditableModelSchema {
    name: string;
    height: number;
    yards: MastYardSchema[];
}

export interface MastSchema extends AuditableModelSchema {
    prefix: string;
    latitude: number;
    longitude: number;
    rotation: number;

    config: MastConfigSchema | null;
}

export interface ComplexSchema extends AuditableModelSchema {
    name: string;
    is_private: boolean;
    latitude: number;
    longitude: number;
    address: string | null;
    is_secreted: boolean;
}

export interface ComplexWithCreatorSchema extends ComplexSchema {
    creator: UserWithRoleSchema | null;
}

export interface ComplexWithMastsSchema extends ComplexWithCreatorSchema {
    masts: MastSchema[];
}

export interface ComplexWithFavoriteInfoSchema extends ComplexWithMastsSchema {
    is_favorite: boolean;
    secretkey: string | null;
}
