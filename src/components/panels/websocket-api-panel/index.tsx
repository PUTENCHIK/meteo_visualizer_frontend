import { InputLabel } from '@components/input-label';
import { Toggle } from '@components/toggle';
import type { PanelProps } from '@context/panel-context/panels';
import { useSocket } from '@context/websocket-context';
import { BasePanel } from '@panels/base-panel';

export const WebsocketApiPanel: React.FC<PanelProps<'websocketApi'>> = () => {
    const {
        connectionEnabled,
        isConnecting,
        isConnected,
        toggleConnection,
    } = useSocket();

    return (
        <BasePanel
            panelId='websocketApi'
            title='Конфиг вебсокета'>
            <InputLabel label='Подключение' orientation='horizontal'>
                <Toggle
                    value={isConnected}
                    intermediate={isConnecting || (connectionEnabled && !isConnected)}
                    onChange={toggleConnection}
                />
            </InputLabel>
        </BasePanel>
    );
};
