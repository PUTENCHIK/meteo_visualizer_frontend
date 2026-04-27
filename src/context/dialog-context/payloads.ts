import type { DeleteMode } from '@dialogs/confirm-delete-dialog';
import type { EntityType } from '@dialogs/entity-dialog/queries';
import type {
    AuditableModelSchema,
    ComplexWithCreatorSchema,
    MastConfigSchema,
    MeasureWithDependentsSchema,
} from '@utils/schemas';
import type { Guid } from 'typescript-guid';

export type DialogPayloads = {
    profile: undefined;
    settings: undefined;
    entity: { entityId: Guid; type: EntityType };
    'edit-user': { userId: Guid } | undefined;
    'edit-role': { roleId: Guid } | undefined;
    'edit-complex': { complexId: Guid } | undefined;
    'edit-mast': { complex: ComplexWithCreatorSchema; mastId?: Guid };
    'edit-mast-config': { configId: Guid } | undefined;
    'edit-mast-yard': { config: MastConfigSchema; mastYardId?: Guid };
    'edit-measure': { measureId: Guid } | undefined;
    'edit-measure-color': { measure: MeasureWithDependentsSchema; colorId?: Guid };
    'edit-measure-alias': { measure: MeasureWithDependentsSchema; aliasId?: Guid };
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
