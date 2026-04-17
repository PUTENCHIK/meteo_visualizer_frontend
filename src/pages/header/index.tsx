import clsx from 'clsx';
import s from './header.module.scss';
import { IconButton } from '@components/icon-button';
import { useDialogs } from '@context/dialog-context';
import { ProfileDialog } from '@dialogs/profile-dialog';
import { SettingsDialog } from '@dialogs/settings-dialog';
import { Link, useLocation } from 'react-router-dom';
import { headerNavItems } from '@utils/nav';
import { ComponentHeader } from '@components/component-header';

export const Header = () => {
    const { openDialog } = useDialogs();
    const location = useLocation();

    return (
        <>
            <div className={clsx(s['header'])}>
                <div className={clsx(s['content'])}>
                    <ComponentHeader
                        left={[
                            <h3>
                                <Link className={clsx('link-reset')} to={'/'}>
                                    Meteo Visualizer
                                </Link>
                            </h3>,
                            [
                                headerNavItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        className={clsx(
                                            'link-reset',
                                            s['header-item'],
                                            location.pathname === `${item.path}` && s['current'],
                                        )}
                                        to={item.path}>
                                        {item.title}
                                    </Link>
                                )),
                            ],
                        ]}
                        right={[
                            [
                                <span>v0.2.0</span>,
                                <IconButton
                                    iconName='user'
                                    title='Профиль'
                                    iconSize={24}
                                    onClick={() => openDialog('profile')}
                                />,
                                <IconButton
                                    iconName='settings'
                                    title='Настройки'
                                    iconSize={24}
                                    onClick={() => openDialog('settings')}
                                />,
                            ],
                        ]}
                        size='big'
                    />
                </div>
            </div>
            <ProfileDialog />
            <SettingsDialog />
        </>
    );
};
