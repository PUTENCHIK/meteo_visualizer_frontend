import { Button } from '@components/button';
import { InputLabel } from '@components/input-label';
import { NumberInput } from '@components/number-input';
import { TextInput } from '@components/text-input';
import { Toggle } from '@components/toggle';
import { useSocket } from '@context/websocket-context';
import { BasePanel } from '@panels/base-panel';
import { useState } from 'react';

export const WebsocketApiPanel = () => {
    const {
        connectionEnabled,
        isConnecting,
        isConnected,
        toggleConnection,
        config,
        updateConfig,
        socketUrl,
    } = useSocket();

    const [host, setHost] = useState(config.host);
    const [port, setPort] = useState(config.port);

    const handleReset = () => {
        setHost(config.host);
        setPort(config.port);
    };

    const handleSave = () => {
        updateConfig(host, port);
    };

    return (
        <BasePanel
            panelId='websocketApi'
            title='Конфиг вебсокета'
            buttons={[
                <Button title='Сбросить' onClick={handleReset} />,
                <Button title='Сохранить' type='primary' onClick={handleSave} />,
            ]}>
            <InputLabel label='Подключение' orientation='horizontal'>
                <Toggle
                    value={isConnected}
                    intermediate={isConnecting || (connectionEnabled && !isConnected)}
                    onChange={toggleConnection}
                />
            </InputLabel>
            <span>Адрес: {socketUrl}</span>
            <InputLabel label='Хост'>
                <TextInput key={host} defaultValue={host} placeholder={host} onChange={setHost} />
            </InputLabel>
            <InputLabel label='Порт'>
                <NumberInput
                    key={port}
                    defaultValue={port}
                    placeholder={port.toString()}
                    min={1}
                    maxLength={5}
                    onChange={(v?: number) => setPort(v ?? 0)}
                />
            </InputLabel>
        </BasePanel>
    );
};
