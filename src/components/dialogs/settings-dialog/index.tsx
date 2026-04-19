import { InputLabel } from '@components/input-label';
import { Toggle } from '@components/toggle';
import type { DialogProps } from '@context/dialog-context/dialogs';
import { useTheme } from '@context/theme-context';
import { BaseDialog } from '@dialogs/base-dialog';

export const SettingsDialog: React.FC<DialogProps<'settings'>> = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <BaseDialog dialogId='settings' title='Настройки сервиса'>
            <InputLabel label='Тёмная тема' orientation='horizontal'>
                <Toggle value={theme === 'dark'} onChange={toggleTheme} />
            </InputLabel>
        </BaseDialog>
    );
};
