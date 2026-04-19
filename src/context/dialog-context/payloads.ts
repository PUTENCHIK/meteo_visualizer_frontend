import type { DeleteMode } from '@dialogs/confirm-delete-dialog';
import type { AuditableModelSchema, ComplexSchema } from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export type DialogPayloads = {
    profile: undefined;
    settings: undefined;
    'edit-complex': { complexId: Guid } | undefined;
    'confirm-delete': {
        mode: DeleteMode;
        onSubmit: (force: boolean) => Promise<void>;
        extra?: {
            entityName: string;
            entity: AuditableModelSchema;
        };
    };
    'edit-mast': { complex: ComplexSchema; mastId?: Guid };
};
