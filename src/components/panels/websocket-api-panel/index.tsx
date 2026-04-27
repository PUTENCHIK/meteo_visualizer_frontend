import { ComponentRowBox } from '@components/component-row-box';
import { InputLabel } from '@components/input-label';
import { Loader } from '@components/loader';
import { TextInput } from '@components/text-input';
import { Toggle } from '@components/toggle';
import type { PanelProps } from '@context/panel-context/panels';
import { useSocket } from '@context/websocket-context';
import { BasePanel } from '@panels/base-panel';
import { useComplexStore } from '@stores/complex-store';

export const WebsocketApiPanel: React.FC<PanelProps<'websocketApi'>> = () => {
    const { connectionEnabled, isConnecting, isConnected, toggleConnection } = useSocket();
    const { complex } = useComplexStore();

    const address = complex?.address;

    return (
        <BasePanel
            panelId='websocketApi'
            title='Соединение с API комплекса'
            noContent={{
                cond: () => !address,
                label: <span>Адрес не установлен, невозможно подключиться</span>,
            }}>
            {address && (
                <>
                    <ComponentRowBox
                        left={[
                            <InputLabel label='Подключение' orientation='horizontal'>
                                <Toggle
                                    value={isConnected}
                                    intermediate={
                                        isConnecting || (connectionEnabled && !isConnected)
                                    }
                                    onChange={toggleConnection}
                                />
                            </InputLabel>,
                            isConnecting && <Loader size={24} />,
                        ]}
                    />
                    <InputLabel label='Адрес TCP'>
                        <TextInput value={address} readOnly />
                    </InputLabel>
                </>
            )}
        </BasePanel>
    );
};
