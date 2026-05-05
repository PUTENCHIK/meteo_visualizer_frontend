import type { Guid } from 'typescript-guid';
import type { AuditableModelSchema } from './base';
import type { UserWithRoleSchema } from './users';

export interface MeasureAliasSchema extends AuditableModelSchema {
    measure_id: Guid;
    name: string;
}

export interface MeasureColorSchema extends AuditableModelSchema {
    measure_id: Guid;
    value: string;
    percent: number;
}

export interface MeasureWithDependentsSchema extends AuditableModelSchema {
    name: string;
    min: number;
    max: number;
    units: string;
    creator_id: Guid | null;
    creator: UserWithRoleSchema | null;
    colors: MeasureColorSchema[];
    aliases: MeasureAliasSchema[];
}
