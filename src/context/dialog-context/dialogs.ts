import type { DialogId } from '@context/dialog-context';
import { EditComplexDialog } from '@dialogs/edit-complex-dialog';
import { ProfileDialog } from '@dialogs/profile-dialog';
import { SettingsDialog } from '@dialogs/settings-dialog';
import type { DialogPayloads } from './payloads';
import { ConfirmDeleteDialog } from '@dialogs/confirm-delete-dialog';
import { EditMastDialog } from '@dialogs/edit-mast-dialog';
import { ConfirmRestoreDialog } from '@dialogs/confirm-restore-dialog';

export interface DialogProps<K extends DialogId> {
    data: DialogPayloads[K];
}

export const dialogComponents: { [K in DialogId]: React.FC<any> } = {
    profile: ProfileDialog,
    settings: SettingsDialog,
    'edit-complex': EditComplexDialog,
    'edit-mast': EditMastDialog,
    'confirm-delete': ConfirmDeleteDialog,
    'confirm-restore': ConfirmRestoreDialog,
};
