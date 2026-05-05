import type { DialogId } from '@context/dialog-context';
import { EditComplexDialog } from '@dialogs/edit-complex-dialog';
import { ProfileDialog } from '@dialogs/profile-dialog';
import { SettingsDialog } from '@dialogs/settings-dialog';
import type { DialogPayloads } from './payloads';
import { ConfirmDeleteDialog } from '@dialogs/confirm-delete-dialog';
import { EditMastDialog } from '@dialogs/edit-mast-dialog';
import { ConfirmRestoreDialog } from '@dialogs/confirm-restore-dialog';
import { EditMastConfigDialog } from '@dialogs/edit-mast-config-dialog';
import { EditMastYardDialog } from '@dialogs/edit-mast-yard-dialog';
import { EntityDialog } from '@dialogs/entity-dialog';
import { EditRoleDialog } from '@dialogs/edit-role-dialog';
import { EditUserDialog } from '@dialogs/edit-user-dialog';
import { EditMeasureDialog } from '@dialogs/edit-measure-dialog';
import { EditMeasureColorDialog } from '@dialogs/edit-measure-color-dialog';
import { EditMeasureAliasDialog } from '@dialogs/edit-measure-alias-dialog';

export interface DialogProps<K extends DialogId> {
    data: DialogPayloads[K];
}

export const dialogComponents: { [K in DialogId]: React.FC<any> } = {
    profile: ProfileDialog,
    settings: SettingsDialog,
    entity: EntityDialog,
    'edit-user': EditUserDialog,
    'edit-role': EditRoleDialog,
    'edit-complex': EditComplexDialog,
    'edit-mast': EditMastDialog,
    'edit-mast-config': EditMastConfigDialog,
    'edit-mast-yard': EditMastYardDialog,
    'edit-measure': EditMeasureDialog,
    'edit-measure-color': EditMeasureColorDialog,
    'edit-measure-alias': EditMeasureAliasDialog,
    'confirm-delete': ConfirmDeleteDialog,
    'confirm-restore': ConfirmRestoreDialog,
};
