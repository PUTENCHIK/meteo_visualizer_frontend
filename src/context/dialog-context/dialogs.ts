import type { DialogId } from '@context/dialog-context';
import { ComplexDialog } from '@dialogs/complex-dialog';
import { ProfileDialog } from '@dialogs/profile-dialog';
import { SettingsDialog } from '@dialogs/settings-dialog';
import type { DialogPayloads } from './payloads';
import { ConfirmDeleteDialog } from '@dialogs/confirm-delete-dialog';

export interface DialogProps<K extends DialogId> {
    data: DialogPayloads[K];
}

export const dialogComponents: { [K in DialogId]: React.FC<any> } = {
    profile: ProfileDialog,
    settings: SettingsDialog,
    complex: ComplexDialog,
    'confirm-delete': ConfirmDeleteDialog,
};
