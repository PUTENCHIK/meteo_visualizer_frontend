import { AppSettingsMenu } from '@components/app-settings/app-settings-menu';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { BaseDialog } from '@dialogs/base-dialog';

export const SettingsDialog: React.FC<DialogProps<'settings'>> = () => {
    return (
        <BaseDialog dialogId='settings' title='Настройки сервиса'>
            <AppSettingsMenu />
        </BaseDialog>
    );
};
