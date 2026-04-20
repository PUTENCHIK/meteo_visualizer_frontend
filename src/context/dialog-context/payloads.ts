import type { DeleteMode } from '@dialogs/confirm-delete-dialog';
import type { AuditableModelSchema, ComplexWithCreatorSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export type DialogPayloads = {
    profile: undefined;
    settings: undefined;
    'edit-complex': { complexId: Guid } | undefined;
    'edit-mast': { complex: ComplexWithCreatorSchema; mastId?: Guid };
    'confirm-delete': {
        mode: DeleteMode;
        onSubmit: (force: boolean) => Promise<void>;
        extra?: {
            entityName: string;
            entity: AuditableModelSchema;
        };
    };
    'confirm-restore': {
        extra?: {
            entityName: string;
            entity: AuditableModelSchema;
        };
        onSubmit: () => Promise<void>;
    };
};
