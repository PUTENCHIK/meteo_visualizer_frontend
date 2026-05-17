import clsx from 'clsx';
import s from './scene-stats.module.scss';
import { useScene } from '@context/scene-context';
import { useSocket } from '@context/websocket-context';
import { useAppSettings } from '@hooks/use-app-settings';

export const SceneStats = () => {
    const { fps } = useScene();
    const { map: settings } = useAppSettings();
    const { isConnected, messagesCount } = useSocket();

    return (
        settings.complexPage.stats.enable && (
            <div className={clsx(s['scene-stats-box'])}>
                <span>FPS: {fps}</span>
                {isConnected && <span>Сообщений / сек: {messagesCount}</span>}
            </div>
        )
    );
};
