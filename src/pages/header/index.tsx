import clsx from 'clsx';
import s from './header.module.scss';
import { IconButton } from '@components/icon-button';

export const Header = () => {
    return (
        <div className={clsx(s['header'])}>
            <div className={clsx(s['content'])}>
                <div className={clsx(s['header-side'])}>
                    <h3>Meteo Visualizer</h3>
                </div>
                <div className={clsx(s['header-side'])}>
                    <span>v0.2.0</span>
                    <IconButton iconName='user' title='Профиль' iconSize={24} />
                    <IconButton iconName='settings' title='Настройки приложения' iconSize={24} />
                </div>
            </div>
        </div>
    );
};
