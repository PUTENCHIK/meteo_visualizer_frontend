import clsx from 'clsx';
import s from './scene-stats.module.scss';
import { useScene } from '@context/scene-context';
import { useSocket } from '@context/websocket-context';

export const SceneStats = () => {
    const { fps } = useScene();
    const { isConnected, messagesCount } = useSocket();

    return (
        <div className={clsx(s['scene-stats-box'])}>
            <span>FPS: {fps}</span>
            {isConnected && <span>Сообщений / сек: {messagesCount}</span>}
        </div>
    );
};
