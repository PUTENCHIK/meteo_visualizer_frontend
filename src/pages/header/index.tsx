import clsx from 'clsx';
import s from './header.module.scss';
import { IconButton } from '@components/icon-button';
import { useDialogs } from '@context/dialog-context';
import { ProfileDialog } from '@dialogs/profile-dialog';

export const Header = () => {
    const { openDialog } = useDialogs();

    return (
        <>
            <div className={clsx(s['header'])}>
                <div className={clsx(s['content'])}>
                    <div className={clsx(s['header-side'])}>
                        <h3>Meteo Visualizer</h3>
                    </div>
                    <div className={clsx(s['header-side'])}>
                        <span>v0.2.0</span>
                        <IconButton
                            iconName='user'
                            title='Профиль'
                            iconSize={24}
                            onClick={() => openDialog('profile')}
                        />
                        <IconButton iconName='settings' title='Настройки приложения' iconSize={24} />
                    </div>
                </div>
            </div>
            <ProfileDialog />
        </>
    );
};
