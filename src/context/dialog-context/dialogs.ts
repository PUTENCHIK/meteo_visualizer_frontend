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

export interface DialogProps<K extends DialogId> {
    data: DialogPayloads[K];
}

export const dialogComponents: { [K in DialogId]: React.FC<any> } = {
    profile: ProfileDialog,
    settings: SettingsDialog,
    entity: EntityDialog,
    'edit-role': EditRoleDialog,
    'edit-complex': EditComplexDialog,
    'edit-mast': EditMastDialog,
    'edit-mast-config': EditMastConfigDialog,
    'edit-mast-yard': EditMastYardDialog,
    'confirm-delete': ConfirmDeleteDialog,
    'confirm-restore': ConfirmRestoreDialog,
};
