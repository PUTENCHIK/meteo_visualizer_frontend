import type { Guid } from 'typescript-guid';

export interface BaseModelSchema {
    created_at: string;
}

export interface AuditableModelSchema extends BaseModelSchema {
    id: Guid;

    updated_at: string;
    deleted_at: string | null;
}

export interface ManyToManyModelSchema extends BaseModelSchema {
    creator_id: string;
}
