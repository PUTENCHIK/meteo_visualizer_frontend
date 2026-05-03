import { ComponentRowBox } from '@components/component-row-box';
import { EntityLabel } from '@components/entity-label';
import { InputLabel } from '@components/input-label';
import { Loader } from '@components/loader';
import { Select } from '@components/select';
import { TextInput } from '@components/text-input';
import { Toggle } from '@components/toggle';
import type { PanelProps } from '@context/panel-context/panels';
import { useSocket } from '@context/websocket-context';
import { useMeasures } from '@hooks/measures/use-measures';
import { BasePanel } from '@panels/base-panel';
import { useComplexStore } from '@stores/complex-store';
import { devicesStore } from '@stores/devices-store';
import { useCallback, useEffect, useMemo } from 'react';

export const WebsocketApiPanel: React.FC<PanelProps<'websocketApi'>> = () => {
    const { connectionEnabled, isConnecting, isConnected, toggleConnection } = useSocket();
    const { complex, measure, setMeasure } = useComplexStore();
    const { data, isLoading, isError } = useMeasures();

    const address = useMemo(() => complex?.address, [complex]);
    const measures = useMemo(
        () => data?.filter((m) => m.colors.length >= 2 && m.aliases.length >= 1),
        [data],
    );

    useEffect(() => {
        setMeasure(measures?.find((m) => measure?.id === m.id) ?? null);
    }, [measures]);

    const handleMeasureChange = useCallback(
        (value: string) => {
            devicesStore.clear();
            setMeasure(measures?.find((m) => m.id.toString() === value) ?? null);
        },
        [measures],
    );

    return (
        <BasePanel
            panelId='websocketApi'
            title='Соединение с API комплекса'
            noContent={{
                cond: () => !address,
                label: <span>Адрес комплекса не установлен, невозможно подключиться</span>,
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
                                    disabled={isLoading || isError || !measure}
                                    onChange={toggleConnection}
                                />
                            </InputLabel>,
                            isConnecting && <Loader size={24} />,
                        ]}
                    />
                    <InputLabel label='Адрес TCP'>
                        <TextInput value={address} readOnly />
                    </InputLabel>

                    {isLoading && <Loader />}
                    {isError && <span>Не удалось загрузить параметры</span>}
                    {!isLoading && !isError && measures ? (
                        <ComponentRowBox
                            left={[
                                [
                                    <span>Параметр:</span>,
                                    <EntityLabel entity={measure} type='measure' linkable />,
                                ],
                                [
                                    <Select
                                        value={measure?.id?.toString() ?? ''}
                                        options={['', ...measures.map((m) => m.id.toString())]}
                                        labels={{
                                            '': 'Выберите параметр',
                                            ...Object.fromEntries(
                                                measures.map((m) => [m.id.toString(), m.name]),
                                            ),
                                        }}
                                        onChange={handleMeasureChange}
                                    />,
                                ],
                            ]}
                        />
                    ) : (
                        <span>Нет ни одного параметра в приложении</span>
                    )}
                </>
            )}
        </BasePanel>
    );
};
